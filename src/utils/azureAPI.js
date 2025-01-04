import { AzureOpenAI } from 'openai';

const AZURE_CONFIG = {
  apiKey: "aa4f2f35c7634fcb8f5b652bbfb36926",
  apiBase: "https://nw-tech-dev.openai.azure.com",
  apiVersion: "2023-12-01-preview",
  deploymentId: "gpt-4-latest",
};

const openai = new AzureOpenAI({
  apiKey: AZURE_CONFIG.apiKey,
  baseURL: AZURE_CONFIG.apiBase,
  apiVersion: AZURE_CONFIG.apiVersion,
  defaultHeaders: {
    "api-key": AZURE_CONFIG.apiKey,
  },
});

export const generateLearningOutcomes = async (content) => {
  const prompt = `I want you to act as a technical instructional designer.\n\nYou have a task to create possible learning outcomes based on the given content.\n\nThese learning outcomes will be tagged to multiple choice questions to understand the effectiveness of the content through data gathered from the users.\n\nGive the learning outcomes as a list of strings:\nAll the strings should be in snake_case\n\nContent:\n${content}`;

  try {
    const response = await openai.completions.create({
      deploymentId: AZURE_CONFIG.deploymentId,
      prompt,
      max_tokens: 300,
    });

    return response.choices[0].text.split('\n').filter(Boolean);
  } catch (error) {
    console.error("Error Details:", error.response?.data || error.message);
    throw new Error("API call failed. Check your configuration or permissions.");
  }
};