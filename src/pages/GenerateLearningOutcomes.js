// src/pages/GenerateLearningOutcomes.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { generateLearningOutcomes } from '../utils/azureAPI';
import "./GenerateLearningOutcomes.css";
import { Typography, Input, Button, Checkbox, List, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const GenerateLearningOutcomes = () => {
  const { content, setContent, learningOutcomes, setLearningOutcomes, selectedOutcomes, setSelectedOutcomes } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setContent(e.target.result);
      message.success(`${file.name} uploaded successfully.`);
    };
    reader.readAsText(file);
    return false; // Prevent automatic upload
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const outcomes = await generateLearningOutcomes(content);
      setLearningOutcomes(outcomes);
    } catch (error) {
      message.error("Error generating learning outcomes.");
    } finally {
      setIsGenerating(false);
    }
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
      <Title level={2} className="page-title">Generate Learning Outcomes</Title>
      <Input.TextArea
        className="content-textarea"
        placeholder="Enter content or upload a file"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
      />
      <Upload
        beforeUpload={handleFileUpload}
        accept=".txt,.md"
        className="file-upload"
      >
        <Button icon={<UploadOutlined />} className="file-upload-btn">
          Upload File
        </Button>
      </Upload>
      <Button
        type="primary"
        className="generate-btn"
        onClick={handleGenerate}
        disabled={!content || isGenerating}
        block
      >
        {isGenerating ? 'Generating...' : 'Generate Learning Outcomes'}
      </Button>

      {learningOutcomes.length > 0 && (
        <div className="outcomes-container">
          <Title level={3}>Learning Outcomes</Title>
          <List
            dataSource={learningOutcomes}
            renderItem={(outcome, index) => (
              <div className="outcome-item">
                <Checkbox
                  checked={selectedOutcomes.includes(outcome)}
                  onChange={() => handleCheckboxChange(outcome)}
                />
                <Text className="outcome-label">
                  {outcome.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Text>
              </div>
            )}
          />
          {selectedOutcomes.length > 0 && (
            <Button
              type="primary"
              className="create-mcqs-btn"
              onClick={handleCreateMCQs}
              block
            >
              Create MCQs
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateLearningOutcomes;
