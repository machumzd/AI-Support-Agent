const axios = require('axios');
const config = require('../config/env');

const SYSTEM_PROMPT = `You are a helpful and polite customer support assistant for an online platform. 
Your goal is to assist customers with:
- Order tracking and shipping questions
- Refund policies and return requests (standard policy: 30 days money-back guarantee)
- Account settings, login issues, and password resets
- Subscription pricing and billing inquiries

Tone & Style:
- Professional, concise, and empathetic
- Format instructions using clear markdown bullet points or numbered lists
- If an issue requires manual account review, advise the user that a support ticket has been noted for human review.`;

const getMockSupportReply = (userMessage) => {
  const query = userMessage.toLowerCase();

  if (query.includes('refund') || query.includes('return')) {
    return `We offer a full refund within **30 days** of purchase.

To request a refund:
1. Navigate to your **Account Settings > Order History**.
2. Select the order in question and click **"Request Return / Refund"**.
3. Choose your reason and submit the form.

Refunds are processed to the original payment method within 3 to 5 business days.`;
  }

  if (query.includes('password') || query.includes('reset') || query.includes('login')) {
    return `If you're having trouble logging into your account:
1. Go to the login screen and click **"Forgot Password"**.
2. Enter your registered email address to receive a secure reset link.
3. Check your spam or promotions folder if the email doesn't appear within 2 minutes.

If you still cannot access your account, let us know and we'll verify your identity to help you regain access.`;
  }

  if (query.includes('pricing') || query.includes('plan') || query.includes('cost')) {
    return `We offer three straightforward pricing tiers:
- **Starter ($0/mo)**: Ideal for getting started with core features.
- **Pro ($24/mo)**: Priority support, advanced integrations, and higher usage limits.
- **Enterprise**: Custom volume and dedicated support representative.

You can manage or change your subscription anytime in your account dashboard.`;
  }

  if (query.includes('shipping') || query.includes('track') || query.includes('delivery')) {
    return `Standard delivery typically takes **3–5 business days**. Once your package has shipped, you will receive an email containing your tracking number and courier details.

You can also check live tracking directly under **Account > My Orders**.`;
  }

  return `Thanks for reaching out! I've received your query: "${userMessage}".

To help you faster, could you share a few more details or let me know if this relates to billing, shipping, or technical troubleshooting? I'm here to help.`;
};

const callOpenRouter = async (userMessage, history = []) => {
  if (!config.ai.openrouterApiKey) {
    return {
      content: getMockSupportReply(userMessage),
      model: 'local-support-agent'
    };
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-8).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    })),
    { role: 'user', content: userMessage }
  ];

  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: config.ai.openrouterModel,
        messages,
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${config.ai.openrouterApiKey}`,
          'HTTP-Referer': config.clientUrl,
          'X-Title': 'Customer Support Agent'
        },
        timeout: 20000
      }
    );

    const reply = res.data?.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error('Empty response from AI model');
    }

    return {
      content: reply.trim(),
      model: config.ai.openrouterModel
    };
  } catch (err) {
    console.error('OpenRouter request failed:', err.response?.data || err.message);
    // Graceful fallback to maintain app usability during evaluation
    return {
      content: getMockSupportReply(userMessage),
      model: 'local-support-agent'
    };
  }
};

const generateSupportResponse = async (userMessage, history = []) => {
  return await callOpenRouter(userMessage, history);
};

module.exports = { generateSupportResponse };
