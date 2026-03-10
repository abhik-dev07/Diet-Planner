import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateMealPlan = mutation({
  args: {
    recipeId: v.id("recipes"),
    date: v.string(),
    mealType: v.string(),
    uid: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("mealPlan", {
      recipeId: args.recipeId,
      date: args.date,
      mealType: args.mealType,
      uid: args.uid,
    });
    return result;
  },
});

export const GetTodaysMealPlan = query({
  args: {
    uid: v.id("users"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch All Meal Plans
    const mealPlans = await ctx.db
      .query("mealPlan")
      .filter((q) =>
        q.and(q.eq(q.field("uid"), args.uid), q.eq(q.field("date"), args.date))
      )
      .collect();
    // Fetch Recipes belong to meal plan
    const result = await Promise.all(
      mealPlans.map(async (mealPlan) => {
        const recipe = await ctx.db.get(mealPlan.recipeId);
        return {
          mealPlan,
          recipe,
        };
      })
    );
    return result;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("mealPlan"),
    status: v.boolean(),
    calories: v.number(),
    proteins: v.number(),
    carbs: v.optional(v.number()),
    fats: v.optional(v.number()),
    fiber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      calories: args.calories,
      proteins: args.proteins,
      carbs: args.carbs,
      fats: args.fats,
      fiber: args.fiber,
    });
  },
});

export const GetTotalConsumedMetrics = query({
  args: {
    date: v.string(),
    uid: v.id("users"),
  },
  handler: async (ctx, args) => {
    const mealPlanResult = await ctx.db
      .query("mealPlan")
      .filter((q) =>
        q.and(
          q.eq(q.field("uid"), args.uid),
          q.eq(q.field("date"), args.date),
          q.eq(q.field("status"), true)
        )
      )
      .collect();

    return mealPlanResult?.reduce(
      (acc, meal) => {
        acc.calories += meal.calories ?? 0;
        acc.proteins += meal.proteins ?? 0;
        acc.carbs += meal.carbs ?? 0;
        acc.fats += meal.fats ?? 0;
        acc.fiber += meal.fiber ?? 0;
        return acc;
      },
      { calories: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 }
    );
  },
});

export const GetTotalCaloriesConsumed = query({
  args: {
    date: v.string(),
    uid: v.id("users"),
  },
  handler: async (ctx, args) => {
    const mealPlanResult = await ctx.db
      .query("mealPlan")
      .filter((q) =>
        q.and(
          q.eq(q.field("uid"), args.uid),
          q.eq(q.field("date"), args.date),
          q.eq(q.field("status"), true)
        )
      )
      .collect();

    return mealPlanResult?.reduce((sum, meal) => sum + (meal.calories ?? 0), 0);
  },
});

export const GetTotalProteinsConsumed = query({
  args: {
    date: v.string(),
    uid: v.id("users"),
  },
  handler: async (ctx, args) => {
    const mealPlanResult = await ctx.db
      .query("mealPlan")
      .filter((q) =>
        q.and(
          q.eq(q.field("uid"), args.uid),
          q.eq(q.field("date"), args.date),
          q.eq(q.field("status"), true)
        )
      )
      .collect();

    return mealPlanResult?.reduce((sum, meal) => sum + (meal.proteins ?? 0), 0);
  },
});
