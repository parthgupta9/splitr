// convex/seed.js
import { mutation } from "./_generated/server";

/**
 * Seed database with dummy data using your existing users
 * Run with: npx convex run seed:seedDatabase
 */
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if database already has data to avoid duplicate seeding
    const existingExpenses = await ctx.db.query("expenses").collect();
    if (existingExpenses.length > 0) {
      console.log("Database already has expenses. Skipping seed.");
      return {
        skipped: true,
        existingExpenses: existingExpenses.length,
      };
    }

    // Step 1: Get your existing users
    const users = await ctx.db.query("users").collect();

    if (users.length < 3) {
      console.log(
        "Not enough users in the database. Please ensure you have at least 3 users."
      );
      return {
        skipped: true,
        reason: "Not enough users",
      };
    }

    // Step 2: Create groups
    const groups = await createGroups(ctx, users);

    // Step 3: Create 1-on-1 expenses
    const oneOnOneExpenses = await createOneOnOneExpenses(ctx, users);

    // Step 4: Create group expenses
    const groupExpenses = await createGroupExpenses(ctx, users, groups);

    // Step 5: Create settlements
    const settlements = await createSettlements(
      ctx,
      users,
      groups,
      oneOnOneExpenses,
      groupExpenses
    );

    return {
      success: true,
      stats: {
        users: users.length,
        groups: groups.length,
        oneOnOneExpenses: oneOnOneExpenses.length,
        groupExpenses: groupExpenses.length,
        settlements: settlements.length,
      },
    };
  },
});

// Helper to create groups
interface GroupMember {
    userId: string;
    role: "admin" | "member";
    joinedAt: number;
}

interface GroupData {
    name: string;
    description: string;
    createdBy: string;
    members: GroupMember[];
}

interface Group extends GroupData {
    _id: string;
}

async function createGroups(ctx: any, users: any[]): Promise<Group[]> {
    const now = Date.now();

    // Using the users from your database
    const user1 = users[0]; 
    const user2 = users[1]; 
    const user3 = users[2]; 

    const groupDatas: GroupData[] = [
        {
            name: "Weekend Trip",
            description: "Expenses for our weekend getaway",
            createdBy: user1._id,
            members: [
                { userId: user1._id, role: "admin", joinedAt: now },
                { userId: user2._id, role: "member", joinedAt: now },
                { userId: user3._id, role: "member", joinedAt: now },
            ],
        },
        {
            name: "Office Expenses",
            description: "Shared expenses for our office",
            createdBy: user2._id,
            members: [
                { userId: user2._id, role: "admin", joinedAt: now },
                { userId: user3._id, role: "member", joinedAt: now },
            ],
        },
        {
            name: "Project Alpha",
            description: "Expenses for our project",
            createdBy: user3._id,
            members: [
                { userId: user3._id, role: "admin", joinedAt: now },
                { userId: user1._id, role: "member", joinedAt: now },
                { userId: user2._id, role: "member", joinedAt: now },
            ],
        },
    ];

    const groupIds: string[] = [];
    for (const groupData of groupDatas) {
        const groupId: string = await ctx.db.insert("groups", groupData);
        groupIds.push(groupId);
    }

    // Fetch all groups with their IDs
    return await Promise.all(
        groupIds.map(async (id: string) => {
            const group = await ctx.db.get(id);
            return { ...group, _id: id } as Group;
        })
    );
}

// Helper to create one-on-one expenses
interface ExpenseSplit {
    userId: string;
    amount: number;
    paid: boolean;
}

interface OneOnOneExpenseData {
    description: string;
    amount: number;
    category: string;
    date: number;
    paidByUserId: string;
    splitType: "equal" | "percentage";
    splits: ExpenseSplit[];
    createdBy: string;
}

interface OneOnOneExpense extends OneOnOneExpenseData {
    _id: string;
}

interface User {
    _id: string;
    [key: string]: any;
}

// Remove Ctx interface and use 'any' for ctx to match Convex context

async function createOneOnOneExpenses(
    ctx: any,
    users: User[]
): Promise<OneOnOneExpense[]> {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Using the users from your database
    const user1 = users[0];
    const user2 = users[1];
    const user3 = users[2];

    const expenseDatas: OneOnOneExpenseData[] = [
        {
            description: "Dinner at Indian Restaurant",
            amount: 1250.0,
            category: "foodDrink", // Using ID from expense-categories.js
            date: twoWeeksAgo,
            paidByUserId: user1._id,
            splitType: "equal",
            splits: [
                { userId: user1._id, amount: 625.0, paid: true },
                { userId: user2._id, amount: 625.0, paid: false },
            ],
            createdBy: user1._id,
        },
        {
            description: "Cab ride to airport",
            amount: 450.0,
            category: "transportation",
            date: oneWeekAgo,
            paidByUserId: user2._id,
            splitType: "equal",
            splits: [
                { userId: user1._id, amount: 225.0, paid: false },
                { userId: user2._id, amount: 225.0, paid: true },
            ],
            createdBy: user2._id,
        },
        {
            description: "Movie tickets",
            amount: 500.0,
            category: "entertainment",
            date: oneWeekAgo + 2 * 24 * 60 * 60 * 1000,
            paidByUserId: user3._id,
            splitType: "equal",
            splits: [
                { userId: user2._id, amount: 250.0, paid: false },
                { userId: user3._id, amount: 250.0, paid: true },
            ],
            createdBy: user3._id,
        },
        {
            description: "Groceries",
            amount: 1875.5,
            category: "groceries",
            date: oneMonthAgo,
            paidByUserId: user1._id,
            splitType: "percentage",
            splits: [
                { userId: user1._id, amount: 1312.85, paid: true }, // 70%
                { userId: user3._id, amount: 562.65, paid: false }, // 30%
            ],
            createdBy: user1._id,
        },
        {
            description: "Internet bill",
            amount: 1200.0,
            category: "utilities",
            date: now - 3 * 24 * 60 * 60 * 1000,
            paidByUserId: user2._id,
            splitType: "equal",
            splits: [
                { userId: user2._id, amount: 600.0, paid: true },
                { userId: user3._id, amount: 600.0, paid: false },
            ],
            createdBy: user2._id,
        },
    ];

    const expenseIds: string[] = [];
    for (const expenseData of expenseDatas) {
        const expenseId = await ctx.db.insert("expenses", expenseData);
        expenseIds.push(expenseId);
    }

    // Fetch all expenses with their IDs
    return await Promise.all(
        expenseIds.map(async (id: string) => {
            const expense = await ctx.db.get(id);
            return { ...expense, _id: id } as OneOnOneExpense;
        })
    );
}

// Helper to create group expenses
interface GroupExpenseSplit {
    userId: string;
    amount: number;
    paid: boolean;
}

interface GroupExpenseData {
    description: string;
    amount: number;
    category: string;
    date: number;
    paidByUserId: string;
    splitType: "equal" | "percentage";
    splits: GroupExpenseSplit[];
    groupId: string;
    createdBy: string;
}

interface GroupExpense extends GroupExpenseData {
    _id: string;
}

interface GroupUser {
    _id: string;
    [key: string]: any;
}

interface GroupObj {
    _id: string;
    [key: string]: any;
}

interface GroupCtx {
    db: {
        insert: (table: string, data: any) => Promise<string>;
        get: (id: string) => Promise<any>;
    };
}

async function createGroupExpenses(
    ctx: any,
    users: GroupUser[],
    groups: GroupObj[]
): Promise<GroupExpense[]> {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

    // Using the users from your database
    const user1 = users[0];
    const user2 = users[1];
    const user3 = users[2];

    // Weekend Trip Group Expenses
    const weekendTripExpenses: GroupExpenseData[] = [
        {
            description: "Hotel reservation",
            amount: 9500.0,
            category: "housing",
            date: twoWeeksAgo,
            paidByUserId: user1._id,
            splitType: "equal",
            splits: [
                { userId: user1._id, amount: 3166.67, paid: true },
                { userId: user2._id, amount: 3166.67, paid: false },
                { userId: user3._id, amount: 3166.66, paid: false },
            ],
            groupId: groups[0]._id, // Weekend Trip Group
            createdBy: user1._id,
        },
        {
            description: "Groceries for weekend",
            amount: 2450.75,
            category: "groceries",
            date: twoWeeksAgo + 1 * 24 * 60 * 60 * 1000,
            paidByUserId: user2._id,
            splitType: "equal",
            splits: [
                { userId: user1._id, amount: 816.92, paid: false },
                { userId: user2._id, amount: 816.92, paid: true },
                { userId: user3._id, amount: 816.91, paid: false },
            ],
            groupId: groups[0]._id, // Weekend Trip Group
            createdBy: user2._id,
        },
        {
            description: "Sight-seeing tour",
            amount: 4500.0,
            category: "entertainment",
            date: twoWeeksAgo + 2 * 24 * 60 * 60 * 1000,
            paidByUserId: user3._id,
            splitType: "equal",
            splits: [
                { userId: user1._id, amount: 1500.0, paid: false },
                { userId: user2._id, amount: 1500.0, paid: false },
                { userId: user3._id, amount: 1500.0, paid: true },
            ],
            groupId: groups[0]._id, // Weekend Trip Group
            createdBy: user3._id,
        },
    ];

    // Office Expenses
    interface OfficeExpenseSplit {
        userId: string;
        amount: number;
        paid: boolean;
    }

    interface OfficeExpenseData {
        description: string;
        amount: number;
        category: string;
        date: number;
        paidByUserId: string;
        splitType: "equal" | "percentage";
        splits: OfficeExpenseSplit[];
        groupId: string;
        createdBy: string;
    }

    const officeExpenses: OfficeExpenseData[] = [
        {
            description: "Coffee and snacks",
            amount: 850.0,
            category: "coffee",
            date: oneWeekAgo,
            paidByUserId: user2._id,
            splitType: "equal",
            splits: [
                { userId: user2._id, amount: 425.0, paid: true },
                { userId: user3._id, amount: 425.0, paid: false },
            ],
            groupId: groups[1]._id, // Office Expenses Group
            createdBy: user2._id,
        },
        {
            description: "Office supplies",
            amount: 1250.4,
            category: "shopping",
            date: oneWeekAgo + 2 * 24 * 60 * 60 * 1000,
            paidByUserId: user3._id,
            splitType: "equal",
            splits: [
                { userId: user2._id, amount: 625.2, paid: false },
                { userId: user3._id, amount: 625.2, paid: true },
            ],
            groupId: groups[1]._id, // Office Expenses Group
            createdBy: user3._id,
        },
    ];

    // Project Alpha Expenses
    const projectExpenses: GroupExpenseData[] = [
        {
            description: "Domain purchase",
            amount: 1200.0,
            category: "technology",
            date: now - 5 * 24 * 60 * 60 * 1000,
            paidByUserId: user3._id,
            splitType: "equal",
            splits: [
                { userId: user1._id, amount: 400.0, paid: false },
                { userId: user2._id, amount: 400.0, paid: false },
                { userId: user3._id, amount: 400.0, paid: true },
            ],
            groupId: groups[2]._id, // Project Alpha Group
            createdBy: user3._id,
        },
        {
            description: "Server hosting",
            amount: 3600.0,
            category: "bills",
            date: now - 4 * 24 * 60 * 60 * 1000,
            paidByUserId: user1._id,
            splitType: "equal",
            splits: [
                { userId: user1._id, amount: 1200.0, paid: true },
                { userId: user2._id, amount: 1200.0, paid: false },
                { userId: user3._id, amount: 1200.0, paid: false },
            ],
            groupId: groups[2]._id, // Project Alpha Group
            createdBy: user1._id,
        },
        {
            description: "Project dinner",
            amount: 4800.6,
            category: "foodDrink",
            date: now - 2 * 24 * 60 * 60 * 1000,
            paidByUserId: user2._id,
            splitType: "percentage",
            splits: [
                { userId: user1._id, amount: 1600.2, paid: false }, // 33.33%
                { userId: user2._id, amount: 1600.2, paid: true }, // 33.33%
                { userId: user3._id, amount: 1600.2, paid: false }, // 33.33%
            ],
            groupId: groups[2]._id, // Project Alpha Group
            createdBy: user2._id,
        },
    ];

    // Combine all group expenses
    const allGroupExpenses: GroupExpenseData[] = [
        ...weekendTripExpenses,
        ...officeExpenses,
        ...projectExpenses,
    ];

    const expenseIds: string[] = [];
    for (const expenseData of allGroupExpenses) {
        const expenseId = await ctx.db.insert("expenses", expenseData);
        expenseIds.push(expenseId);
    }

    // Fetch all group expenses with their IDs
    return await Promise.all(
        expenseIds.map(async (id: string) => {
            const expense = await ctx.db.get(id);
            return { ...expense, _id: id } as GroupExpense;
        })
    );
}

// Helper to create settlements
// Helper to create settlements
interface SettlementData {
  amount: number;
  note: string;
  date: number;
  paidByUserId: string;
  receivedByUserId: string;
  relatedExpenseIds?: string[];
  groupId?: string;
  createdBy: string;
}

interface Settlement extends SettlementData {
  _id: string;
}

interface SettlementCtx {
  db: {
    insert: (table: string, data: any) => Promise<string>;
    get: (id: string) => Promise<any>;
  };
}

async function createSettlements(
  ctx: any,
  users: User[],
  groups: GroupObj[],
  oneOnOneExpenses: OneOnOneExpense[],
  groupExpenses: GroupExpense[]
): Promise<Settlement[]> {
  const now = Date.now();
  const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
  const fiveDaysAgo = now - 5 * 24 * 60 * 60 * 1000;

  // Using the users from your database
  const user1 = users[0];
  const user2 = users[1];
  const user3 = users[2];

  // Find a one-on-one expense to settle
  const cabExpense = oneOnOneExpenses.find(
    (expense) => expense.description === "Cab ride to airport"
  );

  // Find some group expenses to settle
  const hotelExpense = groupExpenses.find(
    (expense) => expense.description === "Hotel reservation"
  );

  const coffeeExpense = groupExpenses.find(
    (expense) => expense.description === "Coffee and snacks"
  );

  const settlementDatas: SettlementData[] = [
    // Settlement for cab ride
    {
      amount: 225.0, // Amount user1 owes to user2
      note: "For cab ride",
      date: fiveDaysAgo,
      paidByUserId: user1._id, // User1 pays
      receivedByUserId: user2._id, // User2 receives
      relatedExpenseIds: cabExpense ? [cabExpense._id] : undefined,
      createdBy: user1._id,
    },
    // Settlement for hotel
    {
      amount: 3166.67, // Amount user2 owes to user1
      note: "Hotel payment",
      date: threeDaysAgo,
      paidByUserId: user2._id, // User2 pays
      receivedByUserId: user1._id, // User1 receives
      groupId: groups[0]._id, // Weekend Trip Group
      relatedExpenseIds: hotelExpense ? [hotelExpense._id] : undefined,
      createdBy: user2._id,
    },
    // Settlement for office coffee
    {
      amount: 425.0, // Amount user3 owes to user2
      note: "Office coffee",
      date: now - 1 * 24 * 60 * 60 * 1000,
      paidByUserId: user3._id, // User3 pays
      receivedByUserId: user2._id, // User2 receives
      groupId: groups[1]._id, // Office Expenses Group
      relatedExpenseIds: coffeeExpense ? [coffeeExpense._id] : undefined,
      createdBy: user3._id,
    },
  ];

  const settlementIds: string[] = [];
  for (const settlementData of settlementDatas) {
    const settlementId = await ctx.db.insert("settlements", settlementData);
    settlementIds.push(settlementId);
  }

  // Fetch all settlements with their IDs
  return await Promise.all(
    settlementIds.map(async (id: string) => {
      const settlement = await ctx.db.get(id);
      return { ...settlement, _id: id } as Settlement;
    })
  );
}