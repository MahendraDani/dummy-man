export type TPromtType =
  | "EXPLAIN_LIKE_FIVE"
  | "EXPLAIN_TOPIC"
  | "LIST_TAKEAWAYS"
  | "LONG_SUMMARY"
  | "REPHRASE_FOR_REFERENCE"
  | "SINGLE_PARAGRAPH"
  | "SHORT_SUMMARY"
  | "CUSTOM_PROMPT";

export type TPrompt = {
  UI_TEXT: string;
  SYSTEM_PROMPT: string;
  PROMPT_TYPE: TPromtType;
};
