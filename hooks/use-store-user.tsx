import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  // When this state is set we know the server
  // has stored the user.
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);
  // Call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
useEffect(() => {
  console.log("🟩 useStoreUserEffect running, isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) return;

  async function createUser() {
    console.log("🟩 Calling storeUser mutation...");
    const id = await storeUser();
    console.log("🟩 Mutation returned:", id);
    setUserId(id);
  }

  createUser();
}, [isAuthenticated, storeUser, user?.id]);

  // Combine the local state with the state from context
  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}