import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    picture: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      const data = {
        name: args.name,
        email: args.email,
        picture: args.picture,
        credits: 10,
      };
      const result = await ctx.db.insert("users", data);
      return { ...data, _id: result };
    }
    return user;
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const UpdateUserPref = mutation({
  args: {
    height: v.string(),
    weight: v.string(),
    gender: v.string(),
    goal: v.string(),
    calories: v.optional(v.float64()),
    proteins: v.optional(v.float64()),
    bmr: v.optional(v.float64()),
    maintenance: v.optional(v.float64()),
    activityLevel: v.optional(v.string()),
    carbs: v.optional(v.float64()),
    fats: v.optional(v.float64()),
    fiber: v.optional(v.float64()),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Look up user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error("User not found with email: " + args.email);
    }

    // 2. Patch by ID
    return await ctx.db.patch(user._id, {
      height: args.height,
      weight: args.weight,
      goal: args.goal,
      gender: args.gender,
      calories: args.calories,
      proteins: args.proteins,
      bmr: args.bmr,
      maintenance: args.maintenance,
      activityLevel: args.activityLevel,
      carbs: args.carbs,
      fats: args.fats,
      fiber: args.fiber,
    });
  },
});

export const GetUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});
