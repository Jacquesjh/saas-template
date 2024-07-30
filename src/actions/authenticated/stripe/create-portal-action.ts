"use server";

import {getCurrentUser} from "@/lib/session";
import {createPortalUseCase} from "@/use-cases/stripe/create-portal-use-case";

export async function createPortalAction(returnUrl: string) {
  const user = await getCurrentUser();

  if (!user) {
    return {url: null, message: "Not signed in"};
  }

  if (!user.customerId) {
    return {
      url: null,
      message: "You don't have a billing account yet. Make a purchase first.",
    };
  }

  return await createPortalUseCase(user.customerId, returnUrl);
}
