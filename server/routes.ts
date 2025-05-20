import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertChatMessageSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Middleware to check authentication
  const requireAuth = async (req: any, res: any, next: any) => {
    // Mock authentication for demo purposes
    const email = req.body.email || "priya.singh@example.com";
    
    try {
      const partner = await storage.getPartnerByEmail(email);
      if (!partner) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      req.partner = partner;
      next();
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Error handling middleware
  const handleZodError = (error: any, req: any, res: any, next: any) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    next(error);
  };
  
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Mock login for demo purposes
      const email = req.body.email || "priya.singh@example.com";
      const password = req.body.password || "password";
      
      // Simple validation
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      
      // Get partner by email
      const partner = await storage.getPartnerByEmail(email);
      if (!partner) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we would verify the password here
      
      // Create a session
      req.session = {
        partnerId: partner.id,
      };
      
      // Return partner data
      res.json(partner);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session = null;
    res.json({ message: "Logged out successfully" });
  });
  
  app.get("/api/auth/me", async (req, res) => {
    // For demo purposes, return a default partner
    try {
      const partner = await storage.getPartnerById(1);
      if (!partner) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      res.json(partner);
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Partner dashboard
  app.get("/api/partners/dashboard", requireAuth, async (req, res) => {
    try {
      const partner = req.partner;
      
      // Get partner skills
      const partnerSkills = await storage.getPartnerSkills(partner.id);
      
      // Get partner achievements
      const partnerAchievements = await storage.getPartnerAchievements(partner.id);
      
      // Get next best action
      const nextBestAction = await storage.getNextBestActionForPartner(partner.id);
      
      // Get lead stats
      const leads = await storage.getLeadsByPartnerId(partner.id);
      const hotLeads = leads.filter(lead => (lead.ai_match_score || 0) >= 80);
      
      // Format the data for the dashboard
      const skills = partnerSkills.map(ps => ({
        name: ps.skill.name,
        rating: ps.rating,
        max: ps.max_rating
      }));
      
      const achievements = partnerAchievements.map(pa => ({
        id: pa.achievement_id,
        name: pa.achievement.name,
        date: pa.earned_at.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        icon: pa.achievement.badge_icon_url,
        completed: true
      }));
      
      // Add incomplete achievements
      const allAchievements = await storage.getAllAchievements();
      const earnedAchievementIds = partnerAchievements.map(pa => pa.achievement_id);
      
      const incompleteAchievements = allAchievements
        .filter(a => !earnedAchievementIds.includes(a.id))
        .map(a => ({
          id: a.id,
          name: a.name,
          date: "In progress",
          icon: a.badge_icon_url,
          completed: false
        }));
      
      // Combine earned and incomplete achievements
      const allAchievementsFormatted = [...achievements, ...incompleteAchievements];
      
      // Format next best action
      const nextAction = nextBestAction ? {
        title: nextBestAction.action_type === "call_leads" 
          ? "Call high-potential clients" 
          : "Complete action",
        description: nextBestAction.description,
        actionText: nextBestAction.action_type === "call_leads" ? "Start Calling" : "Take Action"
      } : null;
      
      // Calculate skill progress
      const skillProgress = Math.round(
        (partnerSkills.reduce((sum, ps) => sum + ps.rating, 0) / 
        partnerSkills.reduce((sum, ps) => sum + ps.max_rating, 0)) * 100
      );
      
      res.json({
        earnings_this_month: partner.earnings_this_month,
        earnings_change_percent: 12, // Mock value for demo
        total_leads: leads.length,
        hot_leads_count: hotLeads.length,
        skills,
        skill_progress: skillProgress,
        next_best_action: nextAction,
        achievements: allAchievementsFormatted.slice(0, 4) // Limit to 4 for UI
      });
      
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Leads routes
  app.get("/api/partners/leads/recommended", requireAuth, async (req, res) => {
    try {
      const partner = req.partner;
      
      // Get recommended leads
      const recommendedLeads = await storage.getRecommendedLeadsForPartner(partner.id);
      
      // Format for the UI
      const formattedLeads = recommendedLeads.map(lead => ({
        id: lead.id,
        name: lead.name,
        phone_number: lead.phone_number,
        match_score: lead.ai_match_score || 0,
        interests: lead.product_interest.map(interest => ({ name: interest })),
        pitch_tip: lead.ai_pitch_tip || ""
      }));
      
      res.json(formattedLeads);
      
    } catch (error) {
      console.error("Leads error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // AI Coach routes
  app.get("/api/coach/chat/history", requireAuth, async (req, res) => {
    try {
      const partner = req.partner;
      
      // Get chat history
      const chatHistory = await storage.getChatHistory(partner.id);
      
      // If no history, return default welcome message
      if (!chatHistory) {
        return res.json([
          {
            id: 1,
            sender: "ai",
            content: "Hi! I'm your AI Sales Coach. How can I help you improve your sales skills today?",
            timestamp: new Date().toISOString()
          }
        ]);
      }
      
      res.json(chatHistory.messages);
      
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/coach/chat", requireAuth, async (req, res) => {
    try {
      const partner = req.partner;
      
      // Validate request body
      const validatedData = insertChatMessageSchema.parse(req.body);
      
      // Save user message
      await storage.saveChatMessage(partner.id, validatedData.message, false);
      
      // Generate AI response (mock response for demo)
      const aiResponses = [
        "I understand that challenge. Based on your recent calls, I've noticed you're explaining features well but not connecting them to benefits that resonate emotionally. Try using the 'which means...' technique to link features to customer benefits.",
        "Looking at your sales data, I see that you're most successful when selling insurance products. Have you considered focusing more on those leads? I can help you refine your pitch for insurance products.",
        "That's a great question! When handling objections about price, try acknowledging the concern first, then shift focus to the value. For example: 'I understand that cost is important. That's why I want to highlight how this investment will pay off in the long run...'",
        "Based on my analysis of top performers, the best time to call new leads is between 10-11am and 3-4pm. Would you like me to help you schedule some calls during these peak times?",
        "I've analyzed your conversation patterns and noticed you often move to closing too quickly. Try building more rapport and addressing concerns before discussing the application process. Would you like me to share some specific examples from your recent calls?"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      // Save AI response
      await storage.saveChatMessage(partner.id, randomResponse, true);
      
      res.json({ response: randomResponse });
      
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      
      console.error("Chat error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Community routes
  app.get("/api/community", requireAuth, async (req, res) => {
    try {
      // Get top performers
      const topPerformers = await storage.getTopPerformers();
      
      // Get best practices
      const bestPractices = await storage.getBestPractices();
      
      // Format for the UI
      const formattedTopPerformers = topPerformers.map((performer, index) => ({
        id: performer.id,
        name: performer.name,
        sales_amount: performer.earnings_this_month,
        profile_image_url: performer.profile_image_url || "",
        rank: index + 1
      }));
      
      const formattedBestPractices = bestPractices.map(practice => ({
        id: practice.id,
        author: {
          name: practice.partner.name,
          profile_image_url: practice.partner.profile_image_url || ""
        },
        content: practice.content,
        likes: practice.likes_count,
        comments: practice.comments_count,
        days_ago: Math.floor((Date.now() - practice.created_at.getTime()) / (1000 * 60 * 60 * 24))
      }));
      
      res.json({
        top_performers: formattedTopPerformers,
        best_practices: formattedBestPractices
      });
      
    } catch (error) {
      console.error("Community error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
