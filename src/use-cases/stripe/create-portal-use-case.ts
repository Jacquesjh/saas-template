import {createCustomerPortal} from "@/lib/stripe";

export async function createPortalUseCase(
  customerId: string,
  returnUrl: string
) {
  try {
    const stripePortalUrl = await createCustomerPortal({
      customerId: customerId,
      returnUrl: returnUrl,
    });

    return {url: stripePortalUrl, message: "Success"};
  } catch (error) {
    console.log("Error creating a checkout session for user: ", error);

    return {url: null, message: "Error creating a checkout session for user"};
  }
}
