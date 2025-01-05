import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { generateLearningOutcomes } from '../utils/azureAPI';
import "./GenerateLearningOutcomes.css";

const GenerateLearningOutcomes = () => {
  const { content, setContent, learningOutcomes, setLearningOutcomes, selectedOutcomes, setSelectedOutcomes } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

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

  const handleCreateMCQs = () => {
    navigate('/create-mcqs');
  };

  return (
    <div className="generate-learning-outcomes-container">
      <h1 className="page-title">Generate Learning Outcomes</h1>
      <textarea
        className="content-textarea"
        placeholder="Enter content or upload a file"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="file"
        accept=".txt,.md"
        onChange={handleFileUpload}
        className="file-input"
      />
      <button className="btn generate-btn" onClick={handleGenerate} disabled={!content || isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Learning Outcomes'}
      </button>

      {learningOutcomes.length > 0 && (
        <div className="outcomes-container">
          <h2>Learning Outcomes</h2>
          <ul className="outcomes-list">
            {learningOutcomes.map((outcome, index) => (
              <li key={index} className="outcome-item">
                <input
                  type="checkbox"
                  id={`outcome-${index}`}
                  checked={selectedOutcomes.includes(outcome)}
                  onChange={() => handleCheckboxChange(outcome)}
                />
                <label htmlFor={`outcome-${index}`} className="outcome-label">
                  {outcome.split('_')
                         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                         .join(' ')}
                </label>
              </li>
            ))}
          </ul>
          {selectedOutcomes.length > 0 && (
            <button className="btn create-mcqs-btn" onClick={handleCreateMCQs}>Create MCQs</button>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateLearningOutcomes;