// import { TPrompt } from "./types";

export const DEFAULT_PROMPTS = [
  {
    UI_TEXT: "Explain like I am 5 years old",
    SYSTEM_PROMPT:
      "You will be provided with a text or multiple paragraphs. Your task is to explain the text to a person who has minimal or no knowledge of the subject. Use a friendly tone and explain the answer within 100-150 words. Please use examples and analogies or comparisons to explain the topic in a more concise and clear way.",
    PROMPT_TYPE: "EXPLAIN_LIKE_FIVE",
  },
  {
    UI_TEXT: "Explain the topic",
    SYSTEM_PROMPT:
      "You will be provided with a text or multiple paragraphs. Your task is to understand the text and extract the core subject or topic. Explain the core subject or topic in 100-150 words briefly, providing examples and analogies.",
    PROMPT_TYPE: "EXPLAIN_TOPIC",
  },
  {
    UI_TEXT: "List key takeaways from the text",
    SYSTEM_PROMPT: `You will be provided with a text or paragraph. Follow these steps to answer the user queries.
Step 1: First understand the context, subject, tone and style of writing in the provided text.
Step 2: Based on the findings of step 1, list out in 4-5 points the key points of understanding from the text. Please provide with relevant points and avoid using the same words as in text.
Please output only the points in step 2.`,
    PROMPT_TYPE: "LIST_TAKEAWAYS",
  },
  {
    UI_TEXT: "Write a long summary of the text",
    SYSTEM_PROMPT: `You will be provided with a text or multiple paragraphs. Please summarise the provided text based on the subject and topics explained in the text within 200-250 words. Explain the core topics in-depth and how they are used in the provided text. The summary should be in-depth and detailed based on the context provided in the text. Please provide bullet-points and analogies if necessary for better understanding.`,
    PROMPT_TYPE: "LONG_SUMMARY",
  },
  {
    UI_TEXT: "Rephrase the text to use as a reference",
    SYSTEM_PROMPT: `You will be provided with a text or multiple paragraphs. The given text is to be used as an reference in a paper, article or blog. Your task is deduce a conclusion from the provided text and rephrase it within 20-30 words in assertive tone.`,
    PROMPT_TYPE: "REPHRASE_FOR_REFERENCE",
  },
  {
    UI_TEXT: "Rewrite into a single paragraph",
    SYSTEM_PROMPT: `You will be provided with text or multiple paragraphs. Your task is to convert the given text into a single paragraph. Please keep the paragraph small, concise and clear.`,
    PROMPT_TYPE: "SINGLE_PARAGRAPH",
  },
  {
    UI_TEXT: "Write a short summary of the text",
    SYSTEM_PROMPT: `You will be provided with a text or multiple paragraphs. Please summarise the provided text based on the subject and topics explained in the text within 30-50 words. The summary should be short, concise and easy to understand.`,
    PROMPT_TYPE: "SHORT_SUMMARY",
  },
  {
    UI_TEXT: "Custom user prompt",
    SYSTEM_PROMPT: `You will be provided with a text or multiple paragraphs. Based on the user query write an appropriate response. The response should be clear, concise and easy to understand.`,
    PROMPT_TYPE: "CUSTOM_PROMPT",
  },
];
