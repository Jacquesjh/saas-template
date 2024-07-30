"use client";

import {AuthContext} from "@/contexts/auth-context";
import {User} from "@/models/user";
import * as React from "react";

export interface AuthProviderProps {
  user: User | null;
  children: React.ReactNode;
}

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
  user,
  children,
}) => {
  return (
    <AuthContext.Provider
      value={{
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
