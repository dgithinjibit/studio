
"use client";

import { createContext, useState, useMemo, useEffect } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import type { UserRole } from "@/lib/types";

type RoleContextType = {
  role: UserRole;
  setRole: Dispatch<SetStateAction<UserRole>>;
};

export const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("teacher");

  useEffect(() => {
    // On initial load, try to get the role from localStorage
    const storedRole = localStorage.getItem("userRole") as UserRole;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);


  const value = useMemo(() => ({ role, setRole }), [role]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
