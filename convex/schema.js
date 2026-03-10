import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    credits: v.number(),
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    gender: v.optional(v.string()),
    goal: v.optional(v.string()),
    calories: v.optional(v.float64()),
    proteins: v.optional(v.float64()),
    bmr: v.optional(v.float64()),
    maintenance: v.optional(v.float64()),
    activityLevel: v.optional(v.string()),
    carbs: v.optional(v.float64()),
    fats: v.optional(v.float64()),
    fiber: v.optional(v.float64()),
  }).index("by_email", ["email"]),

  recipes: defineTable({
    jsonData: v.any(),
    uid: v.id("users"),
    imageUrl: v.string(),
    recipeName: v.string(),
  }),

  mealPlan: defineTable({
    recipeId: v.id("recipes"),
    date: v.string(),
    mealType: v.string(),
    uid: v.id("users"),
    status: v.optional(v.boolean()),
    calories: v.optional(v.number()),
    proteins: v.optional(v.number()),
    carbs: v.optional(v.number()),
    fats: v.optional(v.number()),
    fiber: v.optional(v.number()),
  }),
});
