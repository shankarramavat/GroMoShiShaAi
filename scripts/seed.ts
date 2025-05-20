import { db } from "../server/db";
import {
  partners,
  skills,
  partnerSkills,
  leads,
  achievements,
  partnerAchievements,
  nextBestActions,
  bestPractices
} from "../shared/schema";

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await db.delete(bestPractices);
  await db.delete(nextBestActions);
  await db.delete(partnerAchievements);
  await db.delete(achievements);
  await db.delete(partnerSkills);
  await db.delete(leads);
  await db.delete(skills);
  await db.delete(partners);

  console.log("Deleted existing data");

  // Create partners
  const partnersData = [
    {
      firebase_uid: "demo-firebase-uid-1",
      name: "Priya Singh",
      email: "priya.singh@example.com",
      phone_number: "+91 98765 43210",
      location: "Mumbai",
      profile_image_url: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      bio: "Financial advisor with 3 years of experience",
      earnings_this_month: 32800,
      total_sales_value: 328000
    },
    {
      firebase_uid: "demo-firebase-uid-2",
      name: "Neha Gupta",
      email: "neha.gupta@example.com",
      phone_number: "+91 87654 43210",
      location: "Delhi",
      profile_image_url: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      bio: "Financial advisor with 5 years of experience",
      earnings_this_month: 87500,
      total_sales_value: 875000
    },
    {
      firebase_uid: "demo-firebase-uid-3",
      name: "Ravi Desai",
      email: "ravi.desai@example.com",
      phone_number: "+91 76543 21098",
      location: "Bangalore",
      profile_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      bio: "Financial advisor with 4 years of experience",
      earnings_this_month: 72300,
      total_sales_value: 723000
    },
    {
      firebase_uid: "demo-firebase-uid-4",
      name: "Anisha Shah",
      email: "anisha.shah@example.com",
      phone_number: "+91 65432 10987",
      location: "Mumbai",
      profile_image_url: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      bio: "Financial advisor with 3 years of experience",
      earnings_this_month: 68750,
      total_sales_value: 687500
    },
    {
      firebase_uid: "demo-firebase-uid-5",
      name: "Amit Verma",
      email: "amit.verma@example.com",
      phone_number: "+91 54321 09876",
      location: "Hyderabad",
      profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      bio: "Financial advisor with 2 years of experience",
      earnings_this_month: 45200,
      total_sales_value: 452000
    }
  ];

  const insertedPartners = await db.insert(partners).values(partnersData).returning();
  console.log(`Inserted ${insertedPartners.length} partners`);

  // Create skills
  const skillsData = [
    { name: "Sales Pitch", category: "Sales", description: "Ability to convince potential clients" },
    { name: "Product Knowledge", category: "Knowledge", description: "Understanding of financial products" },
    { name: "Client Handling", category: "Relationship", description: "Managing client relationships" },
    { name: "Negotiation", category: "Sales", description: "Negotiation skills with clients" },
    { name: "Financial Analysis", category: "Technical", description: "Analyzing client financial situations" },
    { name: "Digital Marketing", category: "Marketing", description: "Using digital channels to reach clients" },
    { name: "Communication", category: "Soft Skills", description: "Clearly communicating complex financial concepts" },
    { name: "Objection Handling", category: "Sales", description: "Addressing client concerns effectively" }
  ];

  const insertedSkills = await db.insert(skills).values(skillsData).returning();
  console.log(`Inserted ${insertedSkills.length} skills`);

  // Create partner skills
  const partnerSkillsData = [];
  for (const partner of insertedPartners) {
    for (const skill of insertedSkills) {
      partnerSkillsData.push({
        partner_id: partner.id,
        skill_id: skill.id,
        rating: Math.floor(Math.random() * 6) + 5, // Random rating between 5-10
        max_rating: 10,
        assessment_source: "ai_analysis"
      });
    }
  }

  const insertedPartnerSkills = await db.insert(partnerSkills).values(partnerSkillsData).returning();
  console.log(`Inserted ${insertedPartnerSkills.length} partner skills`);

  // Create leads
  const leadsData = [
    {
      assigned_partner_id: insertedPartners[0].id,
      name: "Rahul Sharma",
      phone_number: "+91 98765 43210",
      product_interest: ["Term Insurance", "Mutual Funds"],
      status: "new",
      lead_source: "website",
      ai_match_score: 94,
      ai_pitch_tip: "Rahul recently had a child. Highlight how term insurance can secure his family's future and how SIPs in mutual funds can build an education corpus."
    },
    {
      assigned_partner_id: insertedPartners[0].id,
      name: "Priya Patel",
      phone_number: "+91 95432 10987",
      product_interest: ["Credit Card", "Personal Loan"],
      status: "contacted",
      lead_source: "referral",
      ai_match_score: 87,
      ai_pitch_tip: "Priya is planning a wedding. Emphasize cashback on the Platinum card for wedding shopping and how a personal loan can help cover additional expenses."
    },
    {
      assigned_partner_id: insertedPartners[0].id,
      name: "Vijay Kumar",
      phone_number: "+91 87654 32109",
      product_interest: ["Home Loan", "Health Insurance"],
      status: "new",
      lead_source: "website",
      ai_match_score: 82,
      ai_pitch_tip: "Vijay is a first-time homebuyer. Focus on our competitive interest rates and how bundling health insurance can provide tax benefits along with coverage for his family."
    },
    {
      assigned_partner_id: insertedPartners[1].id,
      name: "Sunita Mehta",
      phone_number: "+91 76543 21098",
      product_interest: ["Investment Plan", "Retirement Plan"],
      status: "new",
      lead_source: "website",
      ai_match_score: 91,
      ai_pitch_tip: "Sunita is approaching mid-career and is concerned about retirement. Emphasize how our retirement plans offer flexibility and tax advantages."
    },
    {
      assigned_partner_id: insertedPartners[1].id,
      name: "Rajesh Khanna",
      phone_number: "+91 65432 10987",
      product_interest: ["Business Loan", "Term Insurance"],
      status: "contacted",
      lead_source: "event",
      ai_match_score: 85,
      ai_pitch_tip: "Rajesh is expanding his business. Focus on how our business loans offer quick disbursement with minimal documentation and how term insurance can protect his business interests."
    }
  ];

  const insertedLeads = await db.insert(leads).values(leadsData).returning();
  console.log(`Inserted ${insertedLeads.length} leads`);

  // Create achievements
  const achievementsData = [
    { 
      name: "First Sale", 
      description: "Completed your first sale", 
      badge_icon_url: "ri-fire-line", 
      criteria_details: {}, 
      achievement_type: "milestone", 
      points_awarded: 10 
    },
    { 
      name: "5 Insurance Sales", 
      description: "Sold 5 insurance policies", 
      badge_icon_url: "ri-award-line", 
      criteria_details: {}, 
      achievement_type: "milestone", 
      points_awarded: 20 
    },
    { 
      name: "Top Performer", 
      description: "Achieved top performer status", 
      badge_icon_url: "ri-star-line", 
      criteria_details: {}, 
      achievement_type: "recognition", 
      points_awarded: 50 
    },
    { 
      name: "10 Credit Cards", 
      description: "Sold 10 credit cards", 
      badge_icon_url: "ri-bank-card-line", 
      criteria_details: {}, 
      achievement_type: "milestone", 
      points_awarded: 30 
    },
    { 
      name: "Skill Master", 
      description: "Reached level 8 in all skills", 
      badge_icon_url: "ri-sword-line", 
      criteria_details: {}, 
      achievement_type: "skill", 
      points_awarded: 40 
    }
  ];

  const insertedAchievements = await db.insert(achievements).values(achievementsData).returning();
  console.log(`Inserted ${insertedAchievements.length} achievements`);

  // Create partner achievements
  const partnerAchievementsData = [
    { 
      partner_id: insertedPartners[0].id, 
      achievement_id: insertedAchievements[0].id, 
      earned_at: new Date("2023-04-15"), 
      context_data: {} 
    },
    { 
      partner_id: insertedPartners[0].id, 
      achievement_id: insertedAchievements[1].id, 
      earned_at: new Date("2023-06-20"), 
      context_data: {} 
    },
    { 
      partner_id: insertedPartners[0].id, 
      achievement_id: insertedAchievements[2].id, 
      earned_at: new Date("2023-07-10"), 
      context_data: {} 
    },
    { 
      partner_id: insertedPartners[1].id, 
      achievement_id: insertedAchievements[0].id, 
      earned_at: new Date("2023-02-10"), 
      context_data: {} 
    },
    { 
      partner_id: insertedPartners[1].id, 
      achievement_id: insertedAchievements[1].id, 
      earned_at: new Date("2023-03-15"), 
      context_data: {} 
    },
    { 
      partner_id: insertedPartners[1].id, 
      achievement_id: insertedAchievements[2].id, 
      earned_at: new Date("2023-04-20"), 
      context_data: {} 
    },
    { 
      partner_id: insertedPartners[1].id, 
      achievement_id: insertedAchievements[3].id, 
      earned_at: new Date("2023-05-25"), 
      context_data: {} 
    }
  ];

  const insertedPartnerAchievements = await db.insert(partnerAchievements).values(partnerAchievementsData).returning();
  console.log(`Inserted ${insertedPartnerAchievements.length} partner achievements`);

  // Create next best actions
  const nextBestActionsData = [
    {
      partner_id: insertedPartners[0].id,
      action_type: "call_leads",
      description: "Call 3 high-potential clients. Your conversion rate peaks between 10-11am. Call these clients now for the best results.",
      related_entity_type: "leads",
      related_entity_id: null,
      priority: 1,
      status: "pending"
    },
    {
      partner_id: insertedPartners[0].id,
      action_type: "skill_development",
      description: "Improve your negotiation skills. Watch our 15-minute video on objection handling techniques.",
      related_entity_type: "skills",
      related_entity_id: insertedSkills[3].id,
      priority: 2,
      status: "pending"
    },
    {
      partner_id: insertedPartners[1].id,
      action_type: "follow_up",
      description: "Follow up with Rajesh Khanna about the business loan. He's more likely to respond in the evening.",
      related_entity_type: "leads",
      related_entity_id: insertedLeads[4].id,
      priority: 1,
      status: "pending"
    }
  ];

  const insertedNextBestActions = await db.insert(nextBestActions).values(nextBestActionsData).returning();
  console.log(`Inserted ${insertedNextBestActions.length} next best actions`);

  // Create best practices
  const bestPracticesData = [
    {
      partner_id: insertedPartners[4].id,
      content: "I've found that sending a personalized WhatsApp message before calling leads to a 40% higher response rate. Try referencing something specific from their profile.",
      likes_count: 24,
      comments_count: 5,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      partner_id: insertedPartners[1].id,
      content: "For health insurance, I always ask about their parents first. It builds trust and shows you care about family, not just making a sale. My closing rate improved by 35%.",
      likes_count: 36,
      comments_count: 12,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      partner_id: insertedPartners[2].id,
      content: "I prepare a simple, visual comparison chart for each client showing how our products compare to competitors. It helps clients make decisions faster and with more confidence.",
      likes_count: 18,
      comments_count: 7,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ];

  const insertedBestPractices = await db.insert(bestPractices).values(bestPracticesData).returning();
  console.log(`Inserted ${insertedBestPractices.length} best practices`);

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the database connection
    await db.$client.end();
    process.exit(0);
  });