import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateMCQs } from '../utils/azureAPI';
// import "./CreateMCQs.css";

const CreateMCQs = () => {
  const { content, selectedOutcomes, mcqConfig, setMcqConfig, setMcqs } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (index, value) => {
    setMcqConfig((prev) => {
      const newConfig = [...prev];
      newConfig[index].count = value;
      return newConfig;
    });
  };

  const handleCreateMCQs = async () => {
    setIsCreating(true);
    const mcqs = await generateMCQs(content, selectedOutcomes, mcqConfig);
    console.log("mcqsssssssssssssssssssssssssssssssss",mcqs)
    setMcqs(mcqs);
    setIsCreating(false);
  };

  return (
    <div className="create-mcqs-container">
      <h1 className="page-title">Create MCQs</h1>
      {selectedOutcomes.map((outcome, index) => (
        <div key={index} className="mcq-config-item">
          <label>{outcome}</label>
          <input
            type="number"
            min="1"
            value={mcqConfig[index]?.count || 1}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        </div>
      ))}
      <button className="btn generate-btn" onClick={handleCreateMCQs} disabled={isCreating}>
        {isCreating ? 'Creating MCQs...' : 'Create MCQs'}
      </button>
    </div>
  );
};

export default CreateMCQs;
