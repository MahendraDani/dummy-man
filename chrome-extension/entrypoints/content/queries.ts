import { gql, useQuery } from '@apollo/client';

export const ASK_AI = gql
`query AskAI (promptType : String, prompt : String) {
  askAI(promptType: $promptType, prompt: $prompt)
}
`;