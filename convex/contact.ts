"use client"
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel"
import { api } from "./_generated/api";
import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const getAllContacts: ReturnType<typeof query> = query({
  handler: async (ctx) => {
    // Validate internal API (cast to any to avoid circular type imports)
    if (!((api as any).users?.getCurrentUser)) {
      throw new Error("internal.users.getCurrentUser is not defined");
    }

    const CurrentUser = await ctx.runQuery((api as any).users.getCurrentUser);
    if (!CurrentUser) throw new Error("Current user not found");

    // Fetch all expenses (remove invalid undefined filter)
    const allExpenses = await ctx.db.query("expenses").collect();

    // Only those related to a group (or personal)
    const userRelatedExpenses = allExpenses.filter((e) =>
      e.paidByUserId === CurrentUser._id ||
      e.splits.some((s) => s.userId === CurrentUser._id)
    );

    const contactIds = new Set<Id<"users">>();

    // Collect IDs
    userRelatedExpenses.forEach((exp) => {
      if (exp.paidByUserId !== CurrentUser._id) {
        contactIds.add(exp.paidByUserId as Id<"users">);
      }

      exp.splits.forEach((s) => {
        if (s.userId !== CurrentUser._id) {
          contactIds.add(s.userId as Id<"users">);
        }
      });
    });

    // Fetch user objects
    const contactUsers = await Promise.all(
      [...contactIds].map(async (id) => {
        const user = await ctx.db.get(id);
        if (!user) throw new Error(`User not found: ${id}`);
        return user;
      })
    );

    // Fetch groups user belongs to
    const groups = await ctx.db.query("groups").collect();

    const userGroups = groups.filter((g) =>
      g.members.some((m) => m.userId === CurrentUser._id)
    );

    const formattedGroups = userGroups.map((g) => ({
      id: g._id,
      name: g.name,
      description: g.description,
      memberCount: g.members.length,
      type: "group",
    }));

    return {
      users: contactUsers,
      groups: formattedGroups,
    };
  },
});

export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    members: v.array(v.id("users")),
  },

  handler: async (ctx, args) => {
    // Get current logged-in user (cast to any to avoid circular type imports)
    const currentUser = await ctx.runQuery((api as any).users.getCurrentUser);
    if (!currentUser) throw new Error("Current user not found");

    // Ensure unique + include current user as admin
    const uniqueMembers = new Set<Id<"users">>(args.members);
    uniqueMembers.add(currentUser._id);

    // Ensure all users exist
    for (const id of uniqueMembers) {
      const user = await ctx.db.get(id);
      if (!user) throw new Error(`User not found: ${id}`);
    }

    // Insert group AFTER checking all users
    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description || "",
      createdBy: currentUser._id,
      members: [...uniqueMembers].map((id) => ({
        userId: id,
        role: id === currentUser._id ? "admin" : "member",
        joinedAt: Date.now(),
      })),
    });

    return groupId;
  },
});

