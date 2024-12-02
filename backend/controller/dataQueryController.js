const { GoogleGenerativeAI } = require("@google/generative-ai");
const { marked } = require("marked");
const dotenv = require("dotenv");
dotenv.config();
const API_KEY = process.env.API_KEYY;
if (!API_KEY) {
  throw new Error(
    "API key for Google Generative AI is missing. Set GOOGLE_GENERATIVE_AI_API_KEY in environment variables."
  );
}
function formatResponse(inputText) {
  let formattedText = marked(inputText);

  formattedText = formattedText.replace(/```(.*?)```/gs, (match, p1) => {
    return `<pre><code class="language-javascript">${p1}</code></pre>`;
  });

  return formattedText;
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const threadHistory = new Map();

async function continueThread(userId, userPrompt) {
  try {
    let threadData = threadHistory.get(userId) || {
      messages: [],
      thread_id: null,
    };

    const history = threadData.messages
      .map((msg) => {
        return `${msg.role}: ${msg.content}`;
      })
      .join("\n");

    const prompt = history
      ? `${history}\nuser: ${userPrompt}\nassistant:`
      : `user: ${userPrompt}\nassistant:`;

    const result = await model.generateContent(prompt);
    const assistantResponse =
      result.response.candidates[0].content.parts[0].text;

    threadData.messages.push({ role: "user", content: userPrompt });
    threadData.messages.push({ role: "assistant", content: assistantResponse });

    if (threadData.messages.length > 50) {
      threadData.messages = threadData.messages.slice(-50);
    }

    threadHistory.set(userId, threadData);

    // setTimeout(()=>{

    //     return formatResponse(assistantResponse);
    // }, 100000)

    return formatResponse(assistantResponse);
  } catch (error) {
    console.error(`Error processing chat for user ${userId}:`, error.message);
    return "Sorry, I couldn't process your request. Please try again later.";
  }
}

module.exports = {
  continueThread,
};
