import {NextResponse, NextRequest} from "next/server";
import {headers} from "next/headers";
import Stripe from "stripe";
import configFile from "@/config";
import {findCheckoutSession} from "@/lib/stripe";
import {getUserByAttribute, getUserById} from "@/data-access/users/get";
import {createUser} from "@/data-access/users/create";
import {User} from "@/models/user";
import {updateUser} from "@/data-access/users/update";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req: NextRequest) {
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  if (!signature) {
    return null;
  }

  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({error: err.message}, {status: 400});
  }

  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;

        const session = await findCheckoutSession(stripeObject.id);

        const customerId = session?.customer as string | undefined;
        const priceId = session?.line_items?.data[0]?.price?.id;
        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);
        let userId = stripeObject.client_reference_id;

        if (!plan) break;

        const customer = (await stripe.customers.retrieve(
          customerId as string
        )) as Stripe.Customer;

        // Get or create the user. userId is normally pass in the checkout session (clientReferenceID) to identify the user when we get the webhook event
        if (!userId) {
          if (customer.email) {
            const user = await getUserByAttribute("email", customer.email);

            if (user) {
              userId = user.uid;
            } else {
              userId = await createUser(customer.email, customer.name || "");
            }
          } else {
            console.error("No user found");
            throw new Error("No user found");
          }
        }

        // Update user data + Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
        await updateUser(userId, {
          customerId: customerId,
          hasAccess: true,
          priceId: priceId,
        });

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail(...);
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;

        const subscription = await stripe.subscriptions.retrieve(
          stripeObject.id
        );

        const user = await getUserByAttribute(
          "customerId",
          subscription.customer
        );

        if (!user) {
          return null;
        }

        // Revoke access to your product
        user.hasAccess = false;
        await updateUser(user.uid, user);

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product

        const stripeObject: Stripe.Invoice = event.data
          .object as Stripe.Invoice;

        const priceId = stripeObject.lines.data[0].price?.id;
        const customerId = stripeObject.customer;

        const user = await getUserByAttribute("customerId", customerId);

        if (!user) {
          return null;
        }

        // Make sure the invoice is for the same plan (priceId) the user subscribed to
        if (user.priceId !== priceId) break;

        // Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
        user.hasAccess = false;
        await updateUser(user.uid, user);

        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
      // Unhandled event type
    }
  } catch (error: any) {
    console.error("stripe error: ", error);
  }

  return NextResponse.json({});
}
