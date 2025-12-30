import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function structureWithLLM({
  originalTitle,
  originalContent,
  externalContents
}) {
  const prompt = `
You are a professional content editor.

ORIGINAL ARTICLE TITLE:
"${originalTitle}"

ORIGINAL ARTICLE CONTENT:
${originalContent}

REFERENCE ARTICLES (for context only):
${externalContents.join("\n\n---\n\n")}

TASK:
Rewrite the article in a clear, structured, readable way.
- Improve clarity and flow
- Use headings and bullet points
- Keep it original
- Do NOT mention sources
- Output clean readable text
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }]
  });

  return response.choices[0].message.content.trim();
}
