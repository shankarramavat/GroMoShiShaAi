import { 
  partners, 
  leads, 
  partnerSkills, 
  skills, 
  achievements, 
  partnerAchievements, 
  nextBestActions, 
  bestPractices,
  aiCoachChatSessions,
  type Partner, 
  type InsertPartner, 
  type Lead, 
  type InsertLead,
  type PartnerSkill,
  type Skill,
  type Achievement,
  type PartnerAchievement,
  type NextBestAction,
  type BestPractice,
  type AiCoachChatSession
} from "@shared/schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // Partner methods
  getPartnerById(id: number): Promise<Partner | undefined>;
  getPartnerByFirebaseUid(firebaseUid: string): Promise<Partner | undefined>;
  getPartnerByEmail(email: string): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: number, data: Partial<Partner>): Promise<Partner | undefined>;
  
  // Lead methods
  getLeadById(id: number): Promise<Lead | undefined>;
  getLeadsByPartnerId(partnerId: number): Promise<Lead[]>;
  getRecommendedLeadsForPartner(partnerId: number, limit?: number): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  
  // Skill methods
  getPartnerSkills(partnerId: number): Promise<(PartnerSkill & { skill: Skill })[]>;
  getAllSkills(): Promise<Skill[]>;
  
  // Achievement methods
  getPartnerAchievements(partnerId: number): Promise<(PartnerAchievement & { achievement: Achievement })[]>;
  getAllAchievements(): Promise<Achievement[]>;
  
  // NextBestAction methods
  getNextBestActionForPartner(partnerId: number): Promise<NextBestAction | undefined>;
  
  // Community methods
  getTopPerformers(limit?: number): Promise<Partner[]>;
  getBestPractices(limit?: number): Promise<(BestPractice & { partner: Partner })[]>;
  
  // AI Coach methods
  getChatHistory(partnerId: number): Promise<AiCoachChatSession | undefined>;
  saveChatMessage(partnerId: number, message: string, isFromAi: boolean): Promise<void>;
}

// For demo purposes, provide mock data when the database isn't available
export class MemStorage implements IStorage {
  private partnersData: Partner[] = [
    {
      id: 1,
      firebase_uid: "demo-firebase-uid",
      name: "Priya Singh",
      email: "priya.singh@example.com",
      phone_number: "+91 98765 43210",
      location: "Mumbai",
      profile_image_url: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      bio: "Financial advisor with 3 years of experience",
      earnings_this_month: 32800,
      total_sales_value: 328000,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  private leadsData: Lead[] = [
    {
      id: 1,
      assigned_partner_id: 1,
      name: "Rahul Sharma",
      phone_number: "+91 98765 43210",
      product_interest: ["Term Insurance", "Mutual Funds"],
      status: "new",
      lead_source: "website",
      ai_match_score: 94,
      ai_pitch_tip: "Rahul recently had a child. Highlight how term insurance can secure his family's future and how SIPs in mutual funds can build an education corpus.",
      last_contacted_at: null,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      assigned_partner_id: 1,
      name: "Priya Patel",
      phone_number: "+91 95432 10987",
      product_interest: ["Credit Card", "Personal Loan"],
      status: "contacted",
      lead_source: "referral",
      ai_match_score: 87,
      ai_pitch_tip: "Priya is planning a wedding. Emphasize cashback on the Platinum card for wedding shopping and how a personal loan can help cover additional expenses.",
      last_contacted_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      assigned_partner_id: 1,
      name: "Vijay Kumar",
      phone_number: "+91 87654 32109",
      product_interest: ["Home Loan", "Health Insurance"],
      status: "new",
      lead_source: "website",
      ai_match_score: 82,
      ai_pitch_tip: "Vijay is a first-time homebuyer. Focus on our competitive interest rates and how bundling health insurance can provide tax benefits along with coverage for his family.",
      last_contacted_at: null,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  private skillsData: Skill[] = [
    { id: 1, name: "Sales Pitch", category: "Sales", description: "Ability to convince potential clients" },
    { id: 2, name: "Product Knowledge", category: "Knowledge", description: "Understanding of financial products" },
    { id: 3, name: "Client Handling", category: "Relationship", description: "Managing client relationships" },
    { id: 4, name: "Negotiation", category: "Sales", description: "Negotiation skills with clients" }
  ];
  
  private partnerSkillsData: PartnerSkill[] = [
    { id: 1, partner_id: 1, skill_id: 1, rating: 7, max_rating: 10, last_assessed_at: new Date(), assessment_source: "ai_analysis" },
    { id: 2, partner_id: 1, skill_id: 2, rating: 8, max_rating: 10, last_assessed_at: new Date(), assessment_source: "ai_analysis" },
    { id: 3, partner_id: 1, skill_id: 3, rating: 6, max_rating: 10, last_assessed_at: new Date(), assessment_source: "ai_analysis" },
    { id: 4, partner_id: 1, skill_id: 4, rating: 5, max_rating: 10, last_assessed_at: new Date(), assessment_source: "ai_analysis" }
  ];
  
  private achievementsData: Achievement[] = [
    { 
      id: 1, 
      name: "First Sale", 
      description: "Completed your first sale", 
      badge_icon_url: "ri-fire-line", 
      criteria_details: {}, 
      achievement_type: "milestone", 
      points_awarded: 10 
    },
    { 
      id: 2, 
      name: "5 Insurance Sales", 
      description: "Sold 5 insurance policies", 
      badge_icon_url: "ri-award-line", 
      criteria_details: {}, 
      achievement_type: "milestone", 
      points_awarded: 20 
    },
    { 
      id: 3, 
      name: "Top Performer", 
      description: "Achieved top performer status", 
      badge_icon_url: "ri-star-line", 
      criteria_details: {}, 
      achievement_type: "recognition", 
      points_awarded: 50 
    },
    { 
      id: 4, 
      name: "10 Credit Cards", 
      description: "Sold 10 credit cards", 
      badge_icon_url: "ri-bank-card-line", 
      criteria_details: {}, 
      achievement_type: "milestone", 
      points_awarded: 30 
    }
  ];
  
  private partnerAchievementsData: PartnerAchievement[] = [
    { id: 1, partner_id: 1, achievement_id: 1, earned_at: new Date("2023-04-15"), context_data: {} },
    { id: 2, partner_id: 1, achievement_id: 2, earned_at: new Date("2023-06-20"), context_data: {} },
    { id: 3, partner_id: 1, achievement_id: 3, earned_at: new Date("2023-07-10"), context_data: {} }
  ];
  
  private nextBestActionsData: NextBestAction[] = [
    {
      id: 1,
      partner_id: 1,
      action_type: "call_leads",
      description: "Call 3 high-potential clients. Your conversion rate peaks between 10-11am. Call these clients now for the best results.",
      related_entity_type: "leads",
      related_entity_id: null,
      priority: 1,
      status: "pending"
    }
  ];
  
  private bestPracticesData: BestPractice[] = [
    {
      id: 1,
      partner_id: 2,
      content: "I've found that sending a personalized WhatsApp message before calling leads to a 40% higher response rate. Try referencing something specific from their profile.",
      likes_count: 24,
      comments_count: 5,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: 2,
      partner_id: 3,
      content: "For health insurance, I always ask about their parents first. It builds trust and shows you care about family, not just making a sale. My closing rate improved by 35%.",
      likes_count: 36,
      comments_count: 12,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    }
  ];
  
  private topPerformersData: Partner[] = [
    {
      id: 2,
      firebase_uid: "top-performer-1",
      name: "Neha Gupta",
      email: "neha.gupta@example.com",
      phone_number: "+91 87654 43210",
      location: "Delhi",
      profile_image_url: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      bio: "Financial advisor with 5 years of experience",
      earnings_this_month: 87500,
      total_sales_value: 875000,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      firebase_uid: "top-performer-2",
      name: "Ravi Desai",
      email: "ravi.desai@example.com",
      phone_number: "+91 76543 21098",
      location: "Bangalore",
      profile_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      bio: "Financial advisor with 4 years of experience",
      earnings_this_month: 72300,
      total_sales_value: 723000,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      firebase_uid: "top-performer-3",
      name: "Anisha Shah",
      email: "anisha.shah@example.com",
      phone_number: "+91 65432 10987",
      location: "Mumbai",
      profile_image_url: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      bio: "Financial advisor with 3 years of experience",
      earnings_this_month: 68750,
      total_sales_value: 687500,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  private chatHistoryData: Record<number, { messages: any[] }> = {
    1: {
      messages: [
        {
          id: 1,
          sender: "ai",
          content: "Hi Priya! I'm your AI Sales Coach. How can I help you improve your sales skills today?",
          timestamp: new Date().toISOString()
        }
      ]
    }
  };
  
  // Partner methods
  async getPartnerById(id: number): Promise<Partner | undefined> {
    return this.partnersData.find(partner => partner.id === id);
  }
  
  async getPartnerByFirebaseUid(firebaseUid: string): Promise<Partner | undefined> {
    return this.partnersData.find(partner => partner.firebase_uid === firebaseUid);
  }
  
  async getPartnerByEmail(email: string): Promise<Partner | undefined> {
    return this.partnersData.find(partner => partner.email === email);
  }
  
  async createPartner(partner: InsertPartner): Promise<Partner> {
    const newPartner: Partner = {
      id: this.partnersData.length + 1,
      ...partner,
      earnings_this_month: 0,
      total_sales_value: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.partnersData.push(newPartner);
    return newPartner;
  }
  
  async updatePartner(id: number, data: Partial<Partner>): Promise<Partner | undefined> {
    const partnerIndex = this.partnersData.findIndex(partner => partner.id === id);
    if (partnerIndex === -1) return undefined;
    
    const updatedPartner = {
      ...this.partnersData[partnerIndex],
      ...data,
      updated_at: new Date()
    };
    this.partnersData[partnerIndex] = updatedPartner;
    return updatedPartner;
  }
  
  // Lead methods
  async getLeadById(id: number): Promise<Lead | undefined> {
    return this.leadsData.find(lead => lead.id === id);
  }
  
  async getLeadsByPartnerId(partnerId: number): Promise<Lead[]> {
    return this.leadsData.filter(lead => lead.assigned_partner_id === partnerId);
  }
  
  async getRecommendedLeadsForPartner(partnerId: number, limit: number = 5): Promise<Lead[]> {
    return this.leadsData
      .filter(lead => lead.assigned_partner_id === partnerId)
      .sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0))
      .slice(0, limit);
  }
  
  async createLead(lead: InsertLead): Promise<Lead> {
    const newLead: Lead = {
      id: this.leadsData.length + 1,
      ...lead,
      last_contacted_at: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.leadsData.push(newLead);
    return newLead;
  }
  
  // Skill methods
  async getPartnerSkills(partnerId: number): Promise<(PartnerSkill & { skill: Skill })[]> {
    return this.partnerSkillsData
      .filter(ps => ps.partner_id === partnerId)
      .map(ps => {
        const skill = this.skillsData.find(s => s.id === ps.skill_id)!;
        return { ...ps, skill };
      });
  }
  
  async getAllSkills(): Promise<Skill[]> {
    return this.skillsData;
  }
  
  // Achievement methods
  async getPartnerAchievements(partnerId: number): Promise<(PartnerAchievement & { achievement: Achievement })[]> {
    return this.partnerAchievementsData
      .filter(pa => pa.partner_id === partnerId)
      .map(pa => {
        const achievement = this.achievementsData.find(a => a.id === pa.achievement_id)!;
        return { ...pa, achievement };
      });
  }
  
  async getAllAchievements(): Promise<Achievement[]> {
    return this.achievementsData;
  }
  
  // NextBestAction methods
  async getNextBestActionForPartner(partnerId: number): Promise<NextBestAction | undefined> {
    return this.nextBestActionsData
      .filter(nba => nba.partner_id === partnerId && nba.status === "pending")
      .sort((a, b) => a.priority - b.priority)[0];
  }
  
  // Community methods
  async getTopPerformers(limit: number = 3): Promise<Partner[]> {
    return this.topPerformersData
      .sort((a, b) => b.earnings_this_month - a.earnings_this_month)
      .slice(0, limit);
  }
  
  async getBestPractices(limit: number = 5): Promise<(BestPractice & { partner: Partner })[]> {
    return this.bestPracticesData
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit)
      .map(bp => {
        const partner = [...this.partnersData, ...this.topPerformersData].find(p => p.id === bp.partner_id)!;
        return { ...bp, partner };
      });
  }
  
  // AI Coach methods
  async getChatHistory(partnerId: number): Promise<AiCoachChatSession | undefined> {
    const history = this.chatHistoryData[partnerId];
    if (!history) return undefined;
    
    return {
      id: 1,
      partner_id: partnerId,
      messages: history.messages,
      created_at: new Date(),
      updated_at: new Date()
    };
  }
  
  async saveChatMessage(partnerId: number, message: string, isFromAi: boolean): Promise<void> {
    if (!this.chatHistoryData[partnerId]) {
      this.chatHistoryData[partnerId] = { messages: [] };
    }
    
    this.chatHistoryData[partnerId].messages.push({
      id: this.chatHistoryData[partnerId].messages.length + 1,
      sender: isFromAi ? "ai" : "user",
      content: message,
      timestamp: new Date().toISOString()
    });
  }
}

// Database implementation would replace this in production
export class DatabaseStorage implements IStorage {
  // Partner methods
  async getPartnerById(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner;
  }
  
  async getPartnerByFirebaseUid(firebaseUid: string): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.firebase_uid, firebaseUid));
    return partner;
  }
  
  async getPartnerByEmail(email: string): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.email, email));
    return partner;
  }
  
  async createPartner(partner: InsertPartner): Promise<Partner> {
    const [newPartner] = await db.insert(partners).values(partner).returning();
    return newPartner;
  }
  
  async updatePartner(id: number, data: Partial<Partner>): Promise<Partner | undefined> {
    const [updatedPartner] = await db
      .update(partners)
      .set({ ...data, updated_at: new Date() })
      .where(eq(partners.id, id))
      .returning();
    return updatedPartner;
  }
  
  // Lead methods
  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }
  
  async getLeadsByPartnerId(partnerId: number): Promise<Lead[]> {
    return db.select().from(leads).where(eq(leads.assigned_partner_id, partnerId));
  }
  
  async getRecommendedLeadsForPartner(partnerId: number, limit: number = 5): Promise<Lead[]> {
    return db
      .select()
      .from(leads)
      .where(eq(leads.assigned_partner_id, partnerId))
      .orderBy(desc(leads.ai_match_score))
      .limit(limit);
  }
  
  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }
  
  // Skill methods
  async getPartnerSkills(partnerId: number): Promise<(PartnerSkill & { skill: Skill })[]> {
    return db
      .select({
        ...partnerSkills,
        skill: skills
      })
      .from(partnerSkills)
      .innerJoin(skills, eq(partnerSkills.skill_id, skills.id))
      .where(eq(partnerSkills.partner_id, partnerId));
  }
  
  async getAllSkills(): Promise<Skill[]> {
    return db.select().from(skills);
  }
  
  // Achievement methods
  async getPartnerAchievements(partnerId: number): Promise<(PartnerAchievement & { achievement: Achievement })[]> {
    return db
      .select({
        ...partnerAchievements,
        achievement: achievements
      })
      .from(partnerAchievements)
      .innerJoin(achievements, eq(partnerAchievements.achievement_id, achievements.id))
      .where(eq(partnerAchievements.partner_id, partnerId));
  }
  
  async getAllAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }
  
  // NextBestAction methods
  async getNextBestActionForPartner(partnerId: number): Promise<NextBestAction | undefined> {
    const [action] = await db
      .select()
      .from(nextBestActions)
      .where(and(
        eq(nextBestActions.partner_id, partnerId),
        eq(nextBestActions.status, "pending")
      ))
      .orderBy(asc(nextBestActions.priority))
      .limit(1);
    
    return action;
  }
  
  // Community methods
  async getTopPerformers(limit: number = 3): Promise<Partner[]> {
    return db
      .select()
      .from(partners)
      .orderBy(desc(partners.earnings_this_month))
      .limit(limit);
  }
  
  async getBestPractices(limit: number = 5): Promise<(BestPractice & { partner: Partner })[]> {
    return db
      .select({
        ...bestPractices,
        partner: partners
      })
      .from(bestPractices)
      .innerJoin(partners, eq(bestPractices.partner_id, partners.id))
      .orderBy(desc(bestPractices.created_at))
      .limit(limit);
  }
  
  // AI Coach methods
  async getChatHistory(partnerId: number): Promise<AiCoachChatSession | undefined> {
    const [session] = await db
      .select()
      .from(aiCoachChatSessions)
      .where(eq(aiCoachChatSessions.partner_id, partnerId))
      .orderBy(desc(aiCoachChatSessions.updated_at))
      .limit(1);
    
    return session;
  }
  
  async saveChatMessage(partnerId: number, message: string, isFromAi: boolean): Promise<void> {
    // Get existing session or create new one
    let session = await this.getChatHistory(partnerId);
    
    const newMessage = {
      id: Date.now(),
      sender: isFromAi ? "ai" : "user",
      content: message,
      timestamp: new Date().toISOString()
    };
    
    if (session) {
      // Update existing session
      const messages = session.messages as any[];
      await db
        .update(aiCoachChatSessions)
        .set({
          messages: [...messages, newMessage],
          updated_at: new Date()
        })
        .where(eq(aiCoachChatSessions.id, session.id));
    } else {
      // Create new session
      await db
        .insert(aiCoachChatSessions)
        .values({
          partner_id: partnerId,
          messages: [newMessage],
          created_at: new Date(),
          updated_at: new Date()
        });
    }
  }
}

// Use MemStorage for demo/development, would use DatabaseStorage in production
export const storage = new MemStorage();
