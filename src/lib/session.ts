import {getTokens} from "next-firebase-auth-edge";
import {cookies} from "next/headers";
import {authGetTokensOptions} from "./auth-config";
import {server_getUserById} from "@/data-access/server/db/users/get";

export async function getCurrentUser() {
  const tokens = await getTokens(cookies(), authGetTokensOptions);

  if (!tokens) {
    return null;
  }

  const user = await server_getUserById(tokens.decodedToken.uid);

  return user;
}
