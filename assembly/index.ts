import { models } from "@hypermode/modus-sdk-as";
import {
  OpenAIChatModel,
  ResponseFormat,
  SystemMessage,
  UserMessage,
} from "@hypermode/modus-sdk-as/models/openai/chat";

export function sayHello(name: string): string {
  return `Welcome Chief! ${name}!`;
}

const modelName: string = "text-generator";
export function askAI(promptType: string, prompt: string): string {
  const model = models.getModel<OpenAIChatModel>(modelName);

  let systemPrompt = "";
  if (promptType === "EXPLAIN_LIKE_FIVE") {
    systemPrompt = `You will be provided with a text or multiple paragraphs.
       Your task is to explain the text to a person who has minimal or no knowledge of the subject.
       Use a friendly tone and explain the answer within 100-150 words. 
       Please use examples and analogies or comparisons to explain the topic in a more concise and clear way.`;
  } else if (promptType === "EXPLAIN_TOPIC") {
    systemPrompt = `You will be provided with a text or multiple paragraphs. 
      Your task is to understand the text and extract the core subject or topic.
      Explain the core subject or topic in 100-150 words briefly, providing examples and analogies.`;
  } else if (promptType === "LIST_TAKEAWAYS") {
    systemPrompt = `You will be provided with a text or paragraph. Follow these steps to answer the user queries.
        Step 1: First understand the context, subject, tone and style of writing in the provided text.
        Step 2: Based on the findings of step 1, list out in 4-5 points the key points of understanding from the text.
        Please provide with relevant points and avoid using the same words as in text.
        Please output only the points in step 2.`;
  } else if (promptType === "LONG_SUMMARY") {
    systemPrompt = `You will be provided with a text or multiple paragraphs. 
    Please summarise the provided text based on the subject and topics 
    explained in the text within 200-250 words. Explain the core topics in-depth and how they are used in the provided text. The summary should be in-depth and detailed based on the context provided in the text. Please provide bullet-points and analogies if necessary for better understanding.`;
  } else if (promptType === "SHORT_SUMMARY") {
    systemPrompt = `You will be provided with a text or multiple paragraphs. Please summarise the provided text based on the subject and topics explained in the text within 30-50 words. The summary should be short, concise and easy to understand.`;
  } else if (promptType === "REPHRASE_FOR_REFERENCE") {
    systemPrompt = `You will be provided with a text or multiple paragraphs. The given text is to be used as an reference in a paper, article or blog. Your task is deduce a conclusion from the provided text and rephrase it within 20-30 words in assertive tone.`;
  } else if (promptType === "SINGLE_PARAGRAPH") {
    systemPrompt = `You will be provided with text or multiple paragraphs. Your task is to convert the given text into a single paragraph. Please keep the paragraph small, concise and clear.`;
  } else if (promptType === "CUSTOM_PROMPT") {
    systemPrompt = `You will be provided with a text or multiple paragraphs. Based on the user query write an appropriate response. The response should be clear, concise and easy to understand.`;
  } else {
    return "Please provide a valid prompt type";
  }

  const input = model.createInput([
    new SystemMessage(systemPrompt),
    new UserMessage(prompt),
  ]);

  input.temperature = 0.7;

  const output = model.invoke(input);
  return output.choices[0].message.content.trim();
}
