const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();
const YOUR_API_KEY =process.env.API_KEYY;

const { marked } = require("marked");

function formatResponse(inputText) {
  let formattedText = marked(inputText);

  formattedText = formattedText.replace(/```(.*?)```/gs, (match, p1) => {
    return `<pre><code class="language-javascript">${p1}</code></pre>`;
  });

  return formattedText;
}

const generateResponse = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({ error: "Prompt is required" });
  }

  const genAI = new GoogleGenerativeAI(YOUR_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);

    res.send({
      response: formatResponse(
        result.response.candidates[0].content.parts[0].text
      ),
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).send({ error: "Failed to generate response" });
  }
};

module.exports = { generateResponse };
