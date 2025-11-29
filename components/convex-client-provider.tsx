"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useStoreUserEffect } from "@/hooks/use-store-user";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function StoreUserInsideProvider() {
  console.log("🟦 StoreUserInsideProvider mounted");
  useStoreUserEffect();
  return null;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <StoreUserInsideProvider />  {/* The hook NOW runs inside provider */}
      {children}
    </ConvexProviderWithClerk>
  );
}
