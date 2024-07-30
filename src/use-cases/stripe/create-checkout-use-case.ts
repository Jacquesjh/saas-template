import {createCheckout} from "@/lib/stripe";

export async function createCheckoutUseCase(
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  mode: "payment" | "subscription",
  userId: string | undefined,
  customerId: string | undefined,
  email: string | undefined
) {
  try {
    const stripeSessionURL = await createCheckout({
      cancelUrl: cancelUrl,
      mode: mode,
      priceId: priceId,
      successUrl: successUrl,
      clientReferenceId: userId,
      user: {customerId: customerId, email: email},
    });

    return {url: stripeSessionURL, message: ""};
  } catch (error) {
    console.error(error);
    return {url: null, message: "Error creating the checkout session"};
  }
}
