"use client";

import {AuthContext} from "@/contexts/auth-context";
import {client_getUserById} from "@/data-access/client/db/users/get";
import {clientAnalytics, clientAuth} from "@/lib/firebase/client-app";
import {User} from "@/models/user";
import {logEvent, setConsent, setUserId} from "firebase/analytics";
import {onIdTokenChanged} from "firebase/auth";
import {useEffect, useState} from "react";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(clientAuth, async (user) => {
      const analytics = await clientAnalytics;

      if (analytics) {
        setUserId(analytics, user?.uid || null);
      }

      // No user logged in
      if (!user) {
        setUser(null);
        return;
      }

      // A user logged in, fetch it's data from DB
      const loggedUser = await client_getUserById(user.uid);

      if (!loggedUser) {
        setUser(null);
        return;
      }

      // Set the user to the context
      setUser(loggedUser);

      // Log and set the analytics stuff
      if (analytics) {
        logEvent(analytics, "login", {});
      }

      // Sets google anlytics consent options
      setConsent({
        ad_personalization: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        analytics_storage: "granted",
        functionality_storage: "granted",
        personalization_storage: "granted",
        security_storage: "granted",
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
