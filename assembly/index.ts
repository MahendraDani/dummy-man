import { models } from "@hypermode/modus-sdk-as";
import {
  OpenAIChatModel,
  ResponseFormat,
  SystemMessage,
  UserMessage,
} from "@hypermode/modus-sdk-as/models/openai/chat";
import {auth} from "@hypermode/modus-sdk-as"

export function sayHello(name: string): string {
  return `Welcome Chief! ${name}!`;
}

const modelName: string = "text-generator"
export function generateText(instruction: string, prompt: string): string {
  const model = models.getModel<OpenAIChatModel>(modelName)
  const input = model.createInput([
    new SystemMessage(instruction),
    new UserMessage(prompt),
  ])

  input.temperature = 0.7

  const output = model.invoke(input)
  return output.choices[0].message.content.trim()
}
