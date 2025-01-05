const express = require('express');
const { AzureOpenAI } = require('openai');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
});

app.post('/generate-learning-outcomes', async (req, res) => {
  const { content } = req.body;

  try {
    const prompt = `I want you to act as a technical instructional designer.\n\nYou have a task to create possible learning outcomes based on the given content.\n\nThese learning outcomes will be tagged to multiple choice questions to understand the effectiveness of the content through data gathered from the users.\n\nGive the learning outcomes as a list of strings:\nAll the strings should be in snake_case\n\nContent:\n${content}`;

    const response = await openai.completions.create({
      deploymentId: AZURE_CONFIG.deploymentId,
      prompt,
      max_tokens: 300,
    });

    res.json(response.choices[0].text.split('\n').filter(Boolean));
  } catch (error) {
    console.error("Error Details:", error);
    res.status(500).send("Failed to generate learning outcomes");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
