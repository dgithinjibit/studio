"use client";

import { RoleContext } from "@/components/providers/role-provider";
import { useContext } from "react";

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
