import {NextResponse, NextRequest} from "next/server";
import {headers} from "next/headers";
import Stripe from "stripe";
import configFile from "@/config";
import {findCheckoutSession} from "@/lib/stripe";
import {server_getUserByAttribute} from "@/data-access/server/db/users/get";
import {server_createUserAuth} from "@/data-access/server/auth/createUser";
import {server_updateUser} from "@/data-access/server/db/users/update";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req: NextRequest) {
  console.log("Received Stripe webhook event");
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({error: "No signature found"}, {status: 400});
  }

  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("Webhook signature verified successfully");
  } catch (err: any) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({error: err.message}, {status: 400});
  }

  eventType = event.type;
  console.log(`Processing event type ${eventType}`);

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        console.log("Handling checkout.session.completed event");
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;

        const session = await findCheckoutSession(stripeObject.id);
        console.log("Checkout session found:", session);

        const customerId = session?.customer as string | undefined;
        const priceId = session?.line_items?.data[0]?.price?.id;
        const plan = configFile.stripe.plans.find((p) =>
          p.priceIds.some((priceObj) => priceObj.priceId === priceId)
        );

        if (!customerId) {
          console.log("No customerId found in checkout session");
          break;
        }

        console.log("CustomerId:", customerId);

        if (!plan) {
          console.log("No matching plan found for priceId:", priceId);
          break;
        }

        const customer = (await stripe.customers.retrieve(
          customerId as string
        )) as Stripe.Customer;
        if (!customer) {
          console.log("No customer found for customerId:", customerId);
          break;
        }
        console.log("Customer retrieved:", customer);

        // Get or create the user.
        // First try to get the user by customerId
        let userId: string | undefined;
        let user = await server_getUserByAttribute("customerId", customerId);

        if (!user && customer.email) {
          // If not found, try to get the user by email
          user = await server_getUserByAttribute("email", customer.email);
        }

        if (user) {
          userId = user.uid;
          console.log("Existing user found:", userId);
        } else if (customer.email) {
          // If not found, create a new user
          userId = await server_createUserAuth(
            customer.email,
            customer.name || ""
          );
          console.log("New user created:", userId);
        }

        if (!userId) {
          console.log("No user found or created");
          break;
        }

        // Update user data + Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
        await server_updateUser(userId, {
          customerId: customerId,
          hasAccess: true,
          priceId: priceId,
        });
        console.log("User updated with new access:", userId);

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail(...);
        //   console.log("Confirmation email sent to user");
        // } catch (e) {
        //   console.error("Email sending failed:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        console.log("Handling checkout.session.expired event");
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        console.log("Handling customer.subscription.updated event");
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        console.log("Handling customer.subscription.deleted event");
        // The customer subscription stopped
        // ❌ Revoke access to the product
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;

        const subscription = await stripe.subscriptions.retrieve(
          stripeObject.id
        );
        console.log("Subscription retrieved:", subscription.id);

        const user = await server_getUserByAttribute(
          "customerId",
          subscription.customer
        );

        if (!user) {
          console.log("No user found for customerId:", subscription.customer);
          break;
        }

        // Revoke access to your product
        user.hasAccess = false;
        await server_updateUser(user.uid, user);
        console.log("User access revoked:", user.uid);

        break;
      }

      case "invoice.paid": {
        console.log("Handling invoice.paid event");
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product

        const stripeObject: Stripe.Invoice = event.data
          .object as Stripe.Invoice;

        const priceId = stripeObject.lines?.data[0]?.price?.id;
        const customerId = stripeObject.customer;

        const user = await server_getUserByAttribute("customerId", customerId);

        if (!user) {
          console.log("No user found for customerId:", customerId);
          break;
        }

        // Make sure the invoice is for the same plan (priceId) the user subscribed to
        if (user.priceId !== priceId) {
          console.log("Invoice priceId doesn't match user's priceId");
          break;
        }

        // Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
        user.hasAccess = true;
        await server_updateUser(user.uid, user);
        console.log("User access granted:", user.uid);

        break;
      }

      case "invoice.payment_failed":
        console.log("Handling invoice.payment_failed event");
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
        console.log("Unhandled event type:", eventType);
      // Unhandled event type
    }
  } catch (e: any) {
    console.error("Stripe webhook error: ", e.message);
  }

  console.log("Stripe webhook processed successfully");
  return NextResponse.json({});
}
