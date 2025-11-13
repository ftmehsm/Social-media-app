"use client";

import React, { createContext, useContext } from "react";
import { Session, User } from "lucia";

interface SessionContextValue {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContextValue }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
