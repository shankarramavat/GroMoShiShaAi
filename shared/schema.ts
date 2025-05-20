import { pgTable, text, serial, integer, timestamp, json, boolean, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Partners (Users)
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  firebase_uid: text("firebase_uid").unique().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone_number: text("phone_number").notNull(),
  location: text("location"),
  profile_image_url: text("profile_image_url"),
  bio: text("bio"),
  earnings_this_month: integer("earnings_this_month").default(0),
  total_sales_value: integer("total_sales_value").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Skills
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  description: text("description"),
});

// Partner Skills
export const partnerSkills = pgTable("partner_skills", {
  id: serial("id").primaryKey(),
  partner_id: integer("partner_id").notNull().references(() => partners.id),
  skill_id: integer("skill_id").notNull().references(() => skills.id),
  rating: integer("rating").notNull(),
  max_rating: integer("max_rating").notNull().default(10),
  last_assessed_at: timestamp("last_assessed_at").defaultNow(),
  assessment_source: text("assessment_source"),
});

// Initial Skill Assessments
export const initialSkillAssessments = pgTable("initial_skill_assessments", {
  id: serial("id").primaryKey(),
  partner_id: integer("partner_id").notNull().references(() => partners.id),
  assessment_data: json("assessment_data"),
  completed_at: timestamp("completed_at").defaultNow(),
});

// Leads
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  assigned_partner_id: integer("assigned_partner_id").references(() => partners.id),
  name: text("name").notNull(),
  phone_number: text("phone_number").notNull(),
  product_interest: text("product_interest").array(),
  status: text("status").notNull().default("new"),
  lead_source: text("lead_source"),
  ai_match_score: integer("ai_match_score"),
  ai_pitch_tip: text("ai_pitch_tip"),
  last_contacted_at: timestamp("last_contacted_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Sales
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  partner_id: integer("partner_id").notNull().references(() => partners.id),
  lead_id: integer("lead_id").references(() => leads.id),
  product_name: text("product_name").notNull(),
  product_category: text("product_category").notNull(),
  sale_amount: integer("sale_amount").notNull(),
  commission_earned: integer("commission_earned").notNull(),
  sale_date: timestamp("sale_date").defaultNow(),
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  badge_icon_url: text("badge_icon_url"),
  criteria_details: json("criteria_details"),
  achievement_type: text("achievement_type").notNull(),
  points_awarded: integer("points_awarded").default(0),
});

// Partner Achievements
export const partnerAchievements = pgTable("partner_achievements", {
  id: serial("id").primaryKey(),
  partner_id: integer("partner_id").notNull().references(() => partners.id),
  achievement_id: integer("achievement_id").notNull().references(() => achievements.id),
  earned_at: timestamp("earned_at").defaultNow(),
  context_data: json("context_data"),
});

// Partner Following
export const partnerFollowing = pgTable("partner_following", {
  id: serial("id").primaryKey(),
  follower_partner_id: integer("follower_partner_id").notNull().references(() => partners.id),
  followed_partner_id: integer("followed_partner_id").notNull().references(() => partners.id),
  created_at: timestamp("created_at").defaultNow(),
});

// Next Best Actions
export const nextBestActions = pgTable("next_best_actions", {
  id: serial("id").primaryKey(),
  partner_id: integer("partner_id").notNull().references(() => partners.id),
  action_type: text("action_type").notNull(),
  description: text("description").notNull(),
  related_entity_type: text("related_entity_type"),
  related_entity_id: integer("related_entity_id"),
  priority: integer("priority").notNull().default(1),
  status: text("status").notNull().default("pending"),
});

// Community Best Practices
export const bestPractices = pgTable("best_practices", {
  id: serial("id").primaryKey(),
  partner_id: integer("partner_id").notNull().references(() => partners.id),
  content: text("content").notNull(),
  likes_count: integer("likes_count").default(0),
  comments_count: integer("comments_count").default(0),
  created_at: timestamp("created_at").defaultNow(),
});

// AI Coach Chat Sessions
export const aiCoachChatSessions = pgTable("ai_coach_chat_sessions", {
  id: serial("id").primaryKey(),
  partner_id: integer("partner_id").notNull().references(() => partners.id),
  messages: json("messages").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Schemas for inserting data
export const insertPartnerSchema = createInsertSchema(partners).omit({ 
  id: true,
  created_at: true,
  updated_at: true
});

export const insertLeadSchema = createInsertSchema(leads).omit({ 
  id: true,
  created_at: true,
  updated_at: true
});

export const insertPartnerSkillSchema = createInsertSchema(partnerSkills).omit({ 
  id: true,
  last_assessed_at: true 
});

export const insertChatMessageSchema = z.object({
  message: z.string().min(1)
});

// Types
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;

export type Skill = typeof skills.$inferSelect;

export type PartnerSkill = typeof partnerSkills.$inferSelect;
export type InsertPartnerSkill = z.infer<typeof insertPartnerSkillSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Sale = typeof sales.$inferSelect;

export type Achievement = typeof achievements.$inferSelect;

export type PartnerAchievement = typeof partnerAchievements.$inferSelect;

export type NextBestAction = typeof nextBestActions.$inferSelect;

export type BestPractice = typeof bestPractices.$inferSelect;

export type AiCoachChatSession = typeof aiCoachChatSessions.$inferSelect;
