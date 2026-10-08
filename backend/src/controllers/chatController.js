const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'MISSING_API_KEY', // Fallback to avoid immediate crash on boot
});

// @desc    Process a chat message from user
// @route   POST /api/chat
// @access  Private
const processChat = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    const userRole = req.user ? req.user.role : 'citizen';

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Role-based prompt tailoring
    let roleInstructions = '';
    if (userRole === 'admin' || userRole === 'officer') {
      roleInstructions = `You are speaking to an Officer/Administrator of the ResolveHub platform. You can suggest ways to manage grievances, track SLA performance, route complaints, and analyze citizen feedback. Do not explain basic citizen features to them unless asked.`;
    } else {
      roleInstructions = `You are speaking to a Citizen on the ResolveHub platform. You can guide them on how to submit a grievance, track their complaint status, or provide feedback. Keep answers simple, empathetic, and civic-focused.`;
    }

    const systemPrompt = `You are the official AI Assistant for 'ResolveHub', a digital civic grievance and complaint management portal.
Your primary role is to assist users in using this website. 

PORTAL KNOWLEDGE BASE (Use this to answer queries):
- SLA metrics: Service Level Agreements (SLA) dictate how fast a complaint must be resolved. Red means breached, yellow means warning.
- Department Breakdown / Analytics: Admins can view complaints grouped by department in the analytics view to track performance.
- Export Reports: Users can click the 'Export' button on the dashboard to download a CSV of current tickets.
- Reassign Complaint: Admins can click 'Reassign' on a ticket to move it to a different department or officer.
- Statuses: Pending (awaiting action), In Progress (being worked on), Resolved (completed), Rejected (invalid). Active Pending means it is assigned but not resolved.
- Notifications: Admins can broadcast messages to all users via the Notification Center.
- Manage Department Heads: Admins can add or remove department heads from the Users panel.
- Pending Tickets / Unassigned Pool: Officers can view unassigned tickets in their department's pool and claim them.
- Request Info: Officers can add a comment to a ticket asking the citizen for more details.
- Resolution Stats: Officers can view their personal resolution rate on their dashboard.
- Update Status: Officers can change a ticket status to Resolved once the civic issue is fixed.
- File a Grievance: Citizens can click 'New Complaint', select a category, upload photos, and submit.
- Broken Streetlight / Potholes: Falls under 'Roads & Infrastructure'.
- Water Leak / Drainage: Falls under 'Water & Sanitation'.
- Photos & Evidence: Photos are highly recommended for evidence but optional unless specified. You cannot add more evidence or photos after submission.
- Edit Complaint: Citizens cannot edit a complaint once it has been submitted.
- Privacy: Citizen addresses and details are kept entirely private from the public, only visible to assigned officers.
- Assigned Officers: Citizens cannot see the specific name of the officer working on their case, only the department, for safety and privacy reasons.
- Delays / How long: Resolution typically takes 3-5 business days depending on the SLA of the category.
- Track Status: Citizens can track status on the 'My Complaints' page or the Dashboard.

CRITICAL RULES:
1. STRICT SCOPE: You must ONLY answer questions related to the ResolveHub platform (complaints, civic issues, tracking, dashboards, website usage). 
2. OFF-TOPIC REJECTION: If a user asks ANYTHING unrelated to ResolveHub, civic grievances, municipal services, or this portal (e.g., coding, math, general history, weather, recipes, pop culture, random facts), you MUST immediately refuse by saying EXACTLY: "I am sorry, but as the ResolveHub Assistant, I can only help with inquiries related to the civic complaint portal and municipal services." Do not try to answer the off-topic question.
3. MULTILINGUAL SUPPORT: If the user asks a question in another language, you must respond in that same language.
4. ROLE AWARENESS: ${roleInstructions}

Be concise, helpful, and professional.`;

    // Construct messages array starting with system prompt, then history, then new message
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message }
    ];

    let reply = '';
    const hasValidApiKey = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'MISSING_API_KEY';

    if (hasValidApiKey) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: messages,
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          temperature: 0.3,
          max_tokens: 512,
        });
        reply = chatCompletion.choices[0]?.message?.content || '';
      } catch (apiErr) {
        console.warn('Groq API call failed, falling back to local portal knowledge:', apiErr.message);
      }
    }

    if (!reply) {
      // Smart offline FAQ fallback for common civic questions
      const lower = message.toLowerCase();
      if (lower.includes('track') || lower.includes('status') || lower.includes('in progress')) {
        reply = "You can track the status of your complaints under 'My Complaints' or on your Dashboard. Status changes from Submitted to Assigned, In Progress, and Resolved.";
      } else if (lower.includes('file') || lower.includes('new') || lower.includes('submit') || lower.includes('grievance')) {
        reply = "To submit a new complaint, click 'New Complaint', select the category (e.g. Water, Electricity, Sanitation), describe your issue, attach photos, and click Submit.";
      } else if (lower.includes('photo') || lower.includes('attachment') || lower.includes('evidence')) {
        reply = "Photos and documents can be attached when submitting a complaint. They provide proof for faster investigation by municipal officers.";
      } else if (lower.includes('password') || lower.includes('forgot') || lower.includes('reset')) {
        reply = "Click 'Forgot Password?' on the Login page and enter your registered email to reset your credentials.";
      } else if (lower.includes('officer') || lower.includes('official') || lower.includes('admin')) {
        reply = "Department officers and administrators can log in via the 'Official' tab on the Login page to manage and route civic grievances.";
      } else if (lower.includes('sla') || lower.includes('deadline') || lower.includes('how long') || lower.includes('delay')) {
        reply = "Each complaint has a Service Level Agreement (SLA) deadline depending on its priority. Critical cases are targeted within 24 hours, while high and medium cases take 3 to 7 days.";
      } else {
        reply = "Welcome to ResolveHub! You can register grievances, track real-time resolution timelines, and receive updates directly from department officers.";
      }
    }

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(200).json({
      success: true,
      reply: 'Welcome to ResolveHub! How can I assist you with your civic grievances or municipal services today?',
    });
  }
};

module.exports = {
  processChat,
};
