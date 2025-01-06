const OPENAI_API_BASE = "https://nw-tech-dev.openai.azure.com";
const OPENAI_API_KEY = "aa4f2f35c7634fcb8f5b652bbfb36926";
const OPENAI_API_VERSION = "2023-12-01-preview";
const OPENAI_API_DEPLOYMENT_ID = "gpt-4-latest";

export const generateLearningOutcomes = async (content) => {
  const prompt = `I want you to act as a technical instructional designer.\n\nYou have a task to create possible learning outcomes based on the given content.\n\nThese learning outcomes will be tagged to multiple choice questions to understand the effectiveness of the content through data gathered from the users.\n\nGive the learning outcomes as a list of strings:\nAll the strings should be in snake_case\n\nContent:\n${content}\n\n Note: Do not provide any help text in the response, just provide the list of learning outcomes without any list style type.`;

  const response = await fetch(`${OPENAI_API_BASE}/openai/deployments/${OPENAI_API_DEPLOYMENT_ID}/chat/completions?api-version=${OPENAI_API_VERSION}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": OPENAI_API_KEY
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a technical instructional designer." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data.choices[0].message.content.trim().split("\n"))
  return data.choices[0].message.content.trim().split("\n");
};

export const generateMCQs = async (content, selectedOutcomes, mcqCounts) => {
  console.log("generateMCQs", selectedOutcomes, mcqCounts)

  const prompt = `**Objective:** You are an technical instructional Designer tasked with developing a set of multiple-choice questions covering all the learning outcomes listed based on the session summary and reading material.\n\n**Input:**\n\n### Content\n\n${content}\n\n### Learning Outcomes\n\n${selectedOutcomes.join('\n')}\n\nLearning Outcomes and Question Counts:\n\n${mcqCounts.map((c) => c.outcome + ":" + c.count).join('')}\n\n**Guidelines:**\n\n- **Question Guidelines:**\n  1. Each question should present a single problem and should be clearly understandable.\n  2. Use positive expressions in the question.\n  3. Avoid tricky or misleading questions.\n  4. Ensure grammatical and syntactical agreement in both the question and the options.\n  5. The question and options should be strictly based on the session transcript summary and reading material content provided earlier.\n  6. Include a code snippet in the question if it is code-related.\n  7. Each question should be standalone and technically correct.\n  8. The MCQs, options, and explanations should be universally technically correct and should not include terms related to *as per the interview*, *according to the session,* or *based on reading material*\n  9. Ensure correct formatting in code-related questions by avoiding enclosing code in backticks and using plain text for quotes.\n\n- **Options Guidelines:**\n  1. Limit the options to four per question.\n  2. Have only one correct and best answer among the options.\n  3. Avoid absolutes like *always*, *never*, etc., in the options.\n  4. Ensure all options are of similar length.\n  5. Avoid terms in the options that are too closely related to the question or that give away the answer.\n  6. Phrase all options similarly for consistency.\n\n- **Explanation Guidelines:**\n  1. Give a strong reasoning for why the option is correct, focusing on the key information that is only mentioned in the provided content.\n  2. Briefly indicate why other options are incorrect, highlighting the distinctions from the correct answer.\n  3. Explanation should not contain the terms *options*, *option 2*, etc.\n  4. The technical terminology should be from the session.\n\n**Output Format:**\n\nTOPIC:<topic>\nSUB_TOPIC:<topic - sub topic>\nQUESTION_KEY:<5 Alpha Numeric characters>\nBASE_QUESTION_KEYS: NA\nQUESTION_TEXT:<The content of the question and should not contain code. The content should be in plain text until and unless it requires markdown syntax>\nLEARNING_OUTCOME: <Pick any of the most suitable learning outcomes from the listed learning outcomes. Ensure learning outcomes should be in snake case>\nCONTENT_TYPE:HTML/MARKDOWN\nQUESTION_TYPE:MULTIPLE_CHOICE(If the code is not *NA*)/CODE_ANALYSIS_MULTIPLE_CHOICE\nCODE:<NA/Code of the question text. Do not give away the answer or correct option in CODE. The code should be formatted and should not be enclosed in backticks.>\nCODE_LANGUAGE:NA/HTML/CSS/SQL/PYTHON/JS/REACT/SHELL/JSON\nOPTION_1:<Option Text without enclosing in quotes unless required/Code in Backticks, if required>\nOPTION_2:<Option Text without enclosing in quotes unless required/Code in Backticks, if required>\nOPTION_3:<Option Text without enclosing in quotes unless required/Code in Backticks, if required>\nOPTION_4:<Option Text without enclosing in quotes unless required/Code in Backticks, if required>\nCORRECT_OPTION: <OPTION_1/OPTION_2/OPTION_3/OPTION_4>\nEXPLANATION: <explanation. Use Text. Do not use Markdown until and unless the explanation requires markdown syntax>\nBLOOM_LEVEL:\n-END-\n\n\n**Example 1:**\n\n\nTOPIC:HTML\nSUB_TOPIC:HTML - Elements\nQUESTION_KEY: ABC12\nBASE_QUESTION_KEYS: NA\nQUESTION_TEXT: Which of the following is the correct way to create a hyperlink in HTML?\nLEARNING_OUTCOME: understanding_html_hyperlinks\nCONTENT_TYPE: TEXT\nQUESTION_TYPE: MULTIPLE_CHOICE\nCODE: NA\nCODE_LANGUAGE: NA\nOPTION_1: <a href=url>Link</a>\nOPTION_2: <link href=url>Link</link>\nOPTION_3: <a src=url>Link</a>\nOPTION_4: <url href=url>Link</url>\nCORRECT_OPTION: OPTION_1\nEXPLANATION: The correct way to create a hyperlink in HTML is using the *a* tag with the *href* attribute to specify the URL.\nBLOOM_LEVEL: Understanding\n-END-\n\n\n**Example 2:**\n\n\nTOPIC:JavaScript\nSUB_TOPIC:JavaScript - Functions\nQUESTION_KEY: DEF34\nBASE_QUESTION_KEYS: NA\nQUESTION_TEXT: What will be the output of the following code snippet?\nLEARNING_OUTCOME: understanding_javascript_functions\nCONTENT_TYPE: MARKDOWN\nQUESTION_TYPE: CODE_ANALYSIS_MULTIPLE_CHOICE\nCODE: \nx = 10\ny = 10\nprint(x + y)\nCODE_LANGUAGE: PYTHON\nOPTION_1: Hello World\nOPTION_2: undefined\nOPTION_3: test\nOPTION_4: Error\nCORRECT_OPTION: OPTION_1\nEXPLANATION: The function test logs *Hello World* to the console when called.\nBLOOM_LEVEL: Application\n-END-\n\n\n**Key Points:**\n- Ensure each question ends with -END-\n- Do not give away the answer or correct option in CODE.`;

  const response = await fetch(`${OPENAI_API_BASE}/openai/deployments/${OPENAI_API_DEPLOYMENT_ID}/chat/completions?api-version=${OPENAI_API_VERSION}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': OPENAI_API_KEY
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a technical instructional designer." },
        { role: "user", content: prompt }
      ],
      max_tokens: 3000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }

  const data = await response.json();
  const rawQuestions = data.choices[0].message.content.trim().split("-END-");

  const convertToJSON = (questionInfo) => {
    const pattern = /(TOPIC|SUB_TOPIC|QUESTION_KEY|BASE_QUESTION_KEYS|QUESTION_TEXT|LEARNING_OUTCOME|CONTENT_TYPE|QUESTION_TYPE|CODE|CODE_LANGUAGE|OPTION_\d+|CORRECT_OPTION|EXPLANATION|BLOOM_LEVEL):([\s\S]*?)(?=(TOPIC|SUB_TOPIC|QUESTION_KEY|BASE_QUESTION_KEYS|QUESTION_TEXT|LEARNING_OUTCOME|CONTENT_TYPE|QUESTION_TYPE|CODE|CODE_LANGUAGE|OPTION_\d+|CORRECT_OPTION|EXPLANATION|BLOOM_LEVEL):|$)/g;
    const matches = [...questionInfo.matchAll(pattern)];
    const questionData = matches.reduce((acc, match) => {
      acc[match[1].trim()] = match[2].trim();
      return acc;
    }, {});
    
    
    // console.log(questionData)
    // Add missing fields like QUESTION_ID, OPTION_X_ID
    questionData["QUESTION_ID"] = generateUUID();
    for (let i = 1; i <= 4; i++) {
      const optionKey = `OPTION_${i}`;
      if (questionData[optionKey]) {
        questionData[`${optionKey}_ID`] = generateUUID();
      }
    }
    
    
    return questionData;
  };

  const generateUUID = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  };

  rawQuestions.pop()

  const questionsJSON = rawQuestions
    .map((rawQuestion) => convertToJSON(rawQuestion))
    .filter((q) => Object.keys(q).length > 0);

  return questionsJSON;
};
