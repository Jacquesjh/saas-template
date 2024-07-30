"use server";

import {getCurrentUser} from "@/lib/session";
import {createCheckoutUseCase} from "@/use-cases/stripe/create-checkout-use-case";

// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card
export async function createCheckoutAction(
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  mode: "payment" | "subscription"
) {
  const user = await getCurrentUser();

  return await createCheckoutUseCase(
    priceId,
    successUrl,
    cancelUrl,
    mode,
    user?.uid,
    user?.customerId,
    user?.email
  );
}
