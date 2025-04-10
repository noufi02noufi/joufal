import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table (combined for both workers and employers)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  role: text("role").notNull(), // "worker" or "employer"
  profilePicture: text("profile_picture"),
  location: jsonb("location").$type<{latitude: number, longitude: number}>(), // Current location
  address: text("address"),
  rating: doublePrecision("rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Worker profiles
export const workerProfiles = pgTable("worker_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  profession: text("profession").notNull(),
  experience: integer("experience").default(0), // in years
  hourlyRate: integer("hourly_rate"), // in cents/paisa
  dailyRate: integer("daily_rate"), // in cents/paisa
  availability: text("availability").default("available"), // "available", "busy", "unavailable"
  bio: text("bio"),
  skills: text("skills").array(),
});

// Jobs
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  budget: integer("budget"), // in cents/paisa
  location: jsonb("location").$type<{latitude: number, longitude: number}>(),
  address: text("address").notNull(),
  employerId: integer("employer_id").notNull().references(() => users.id),
  workerId: integer("worker_id").references(() => users.id),
  status: text("status").default("open"), // "open", "assigned", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
  scheduledFor: timestamp("scheduled_for"),
});

// Markets (hardware stores, tools, supplies)
export const markets = pgTable("markets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // e.g., "hardware", "tools", "paint", etc.
  location: jsonb("location").$type<{latitude: number, longitude: number}>(),
  address: text("address").notNull(),
  phone: text("phone"),
  rating: doublePrecision("rating").default(0),
  items: jsonb("items").$type<Array<{name: string, price: number, description?: string}>>(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id), // reviewer
  targetId: integer("target_id").notNull().references(() => users.id), // worker or market being reviewed
  jobId: integer("job_id").references(() => jobs.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  rating: true,
  createdAt: true,
});

export const insertWorkerProfileSchema = createInsertSchema(workerProfiles).omit({
  id: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  workerId: true,
  status: true,
});

export const insertMarketSchema = createInsertSchema(markets).omit({
  id: true,
  rating: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type WorkerProfile = typeof workerProfiles.$inferSelect;
export type InsertWorkerProfile = z.infer<typeof insertWorkerProfileSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Market = typeof markets.$inferSelect;
export type InsertMarket = z.infer<typeof insertMarketSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Validation schemas for forms
export const userLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

// For search and filtering
export const searchWorkersSchema = z.object({
  profession: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number().default(10), // in km
  minRating: z.number().min(0).max(5).optional(),
  maxRate: z.number().optional(),
});

export const searchJobsSchema = z.object({
  category: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number().default(10), // in km
});

export const searchMarketsSchema = z.object({
  type: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number().default(10), // in km
});
