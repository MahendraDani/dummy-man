# SnipyAI

The exponential growth of digital content presents an exciting opportunity to enhance reading experiences, even as attention spans and comprehension rates face challenges. SnipyAI rises to the occasion with a groundbreaking Chrome extension that brings Large Language Models (LLMs) directly into web browsing.

By utilising Meta Llama 3.1 through Modus and Hypermode's infrastructure, this extension empowers users to elevate their reading comprehension with a simple Cmd + K interface. Users can select any text to receive AI-powered summaries, explanations, and insights, making complex digital content more accessible and understandable.

![Cover Image](/public/images/cover-ss-output.png)

**Deliverables :**

- Chrome Extension - wxt.dev, React, Shadcn UI, Framer Motion
- GraphQL API - Modus, Hypermode, Meta Llama 3.1
- Demo Video : https://youtu.be/aNhvGUf8-JU

# Blog Series
As this project was developed in a month-long hackathon, [ModusHack](https://hashnode.com/hackathons/hypermode?source=hackathon-feed-widget) hosted by Hashnode and Hypermode, I published a series of blog post throughout the month explaining the idea generation, decision making and development process : 

| Title | Description | Date | Link | 
| ----- | ----------- | ---- | ---- |
| ModusHack: KickOff | First impressions of Hypermode and Modus CLI | 02/11/2024 | https://mahendra09.hashnode.dev/kickoff | 
| ModusHack: Research | Read articles, documentation and watched YouTube tutorials for understanding Modus. | 10/11/2024 | https://mahendra09.hashnode.dev/modushack-the-research | 
| ModusHack: Idea | Identifying problem statements and finally landing on a project idea. | 14/11/2024 | https://mahendra09.hashnode.dev/modushack-the-idea | 


# Usage

Select some text on any browser and hit `CMD+K` to open the command modal and ask queries to AI based on the provided text. Watch the demo video to understand more.
<demo video embedd here>

We provide support for seved default commands as well as your own custom prompts.

|  Command | System Prompt | Prompt Type |
|  ------ | ------------- | ---------- | 
| Explain Like I am five years old | You will be provided with a text or multiple paragraphs.Your task is to explain the text to a person who has minimal or no knowledge of the subject.Use a friendly tone and explain the answer within 50-80 words in plain text format. Please use examples and analogies or comparisons to explain the topic in a more concise and clear way. | `EXPLAIN_LIKE_FIVE` |
| Explain the topic from text | You will be provided with a text or multiple paragraphs. Your task is to understand the text and extract the core subject or topic.Explain the core subject or topic in 40-60 words briefly, providing examples and analogies and return the output in plain text format. | `EXPLAIN_TOPIC`
| List key takeaways | You will be provided with a text or paragraph. Follow these steps to answer the user queries. Step 1: First understand the context, subject, tone and style of writing in the provided text. Step 2: Based on the findings of step 1, list out in 4-5 points the key points of understanding from the text. Please provide with relevant points and avoid using the same words as in text. Please output only the points in step 2. | `LIST_TAKEAWAYS` | 
| Write a longer summary | You will be provided with a text or multiple paragraphs.Please summarise the provided text based on the subject and topics explained in the text within 100-150 words. Explain the core topics in-depth and how they are used in the provided text. The summary should be in-depth and detailed based on the context provided in the text. Please provide bullet-points and analogies if necessary for better understanding in plain text format. | `LONG_SUMMARY` |
| Write a short summary | You will be provided with a text or multiple paragraphs. Please summarise the provided text based on the subject and topics explained in the text within 30-50 words in plain text format. The summary should be short, concise and easy to understand. | `SHORT_SUMMARY` | 
| Rephrase to use as a reference | You will be provided with a text or multiple paragraphs. The given text is to be used as an reference in a paper, article or blog. Your task is deduce a conclusion from the provided text and rephrase it within 20-30 words in assertive tone in plain text format | `REPHRASE_FOR_REFERENCE` | 
| Rewrite in a single paragraph | You will be provided with text or multiple paragraphs. Your task is to convert the given text into a single paragraph. Please keep the paragraph small (30-50 words), concise and clear and output in plain text format. | `SINGLE_PARAGRAPH` | 
| Write a custom prompt | You will be provided with a text or multiple paragraphs. Based on the user query write an appropriate response. The response should be clear, concise and easy to understand and output in plain text. Answer within 60-100 words. | `CUSTOM_PROMPT` | 

# Installation and Self Hosting

This guide explains all the steps required to setup the project locally and self host using your own [Hypermode](https://hypermode.com/) account.

1. Fork and clone this repository on your computer
```bash
git clone https://github.com/<username>/snipy/
```

2. Install all the dependencies and modus cli by following the [official docs](https://docs.hypermode.com/modus/overview).
```
cd extension && npm install
```

3. Create a new project on your [Hypermode](https://hypermode.com/) account and obtain the `API_ENDPOINT` and `API_KEY`.

4. Create a new file `extension/.env` and paste the environment variables
```
WXT_API_KEY=<API_KEY>
WXT_DEV_BASE_API=http://localhost:8686/graphql
WXT_PROD_BASE_API=<API_ENDPOINT>
```

5. Execute `modus dev` to run the API in terminal.
6. In another terminal change into `/extension` directory to run the extension : 
```bash
npm run dev
```

If both the services start, you have successfully self hosted the extension!

