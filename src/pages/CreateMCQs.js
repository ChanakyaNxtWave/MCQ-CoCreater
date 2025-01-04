import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateLearningOutcomes } from '../utils/azureAPI';

const CreateMCQs = () => {
  const { content, setContent, learningOutcomes, setLearningOutcomes, selectedOutcomes, setSelectedOutcomes } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const outcomes = await generateLearningOutcomes(content);
    setLearningOutcomes(outcomes);
    setIsGenerating(false);
  };

  const handleCheckboxChange = (outcome) => {
    setSelectedOutcomes((prev) =>
      prev.includes(outcome)
        ? prev.filter((item) => item !== outcome)
        : [...prev, outcome]
    );
  };

  return (
    <div>
      <h1>Create MCQs</h1>
      <textarea
        placeholder="Enter content or upload a file"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={!content || isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Learning Outcomes'}
      </button>

      {learningOutcomes.length > 0 && (
        <div>
          <h2>Learning Outcomes</h2>
          {learningOutcomes.map((outcome, index) => (
            <div key={index}>
              <input
                type="checkbox"
                checked={selectedOutcomes.includes(outcome)}
                onChange={() => handleCheckboxChange(outcome)}
              />
              <label>{outcome}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateMCQs;