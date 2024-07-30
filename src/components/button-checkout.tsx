"use client";

import {createCheckoutAction} from "@/actions/unauthenticated/stripe/create-checkout-action";
import config from "@/config";
import {toast} from "sonner";
import {Button} from "./ui/button";
import {cn} from "@/lib/utils";

// This component is used to create Stripe Checkout Sessions
// It calls the /api/stripe/create-checkout route with the priceId, successUrl and cancelUrl
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card. You can change that in the API route
// You can also change the mode to "subscription" if you want to create a subscription instead of a one-time payment
export default function ButtonCheckout({
  priceId,
  className,
  mode = "payment",
  text = `Get ${config.appName}`,
}: {
  priceId: string;
  className?: string;
  mode?: "payment" | "subscription";
  text?: string;
}) {
  const handlePayment = async () => {
    try {
      const result = await createCheckoutAction(
        priceId,
        window.location.href,
        window.location.href,
        mode
      );

      if (!result.url) {
        toast.error("Error creating your checkout session.");
        return;
      }

      window.location.href = result.url;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button
      variant={"shadow"}
      onClick={handlePayment}
      className={cn("w-full", className)}>
      {text}
    </Button>
  );
}
