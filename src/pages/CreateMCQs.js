// src/pages/CreateMCQs.js
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateMCQs } from '../utils/azureAPI';
import "./CreateMCQs.css";
import { Card, Button, Input, Typography, List, Modal } from 'antd';

const { Title, Text } = Typography;

const CreateMCQs = () => {
  const { content, selectedOutcomes, mcqConfig, setMcqConfig, mcqs, setMcqs } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({});

  // Initialize mcqConfig with default values
  useEffect(() => {
    if (!mcqConfig || mcqConfig.length !== selectedOutcomes.length) {
      const defaultConfig = selectedOutcomes.map((outcome) => ({ outcome, count: 1 }));
      setMcqConfig(defaultConfig);
    }
  }, [selectedOutcomes, mcqConfig, setMcqConfig]);

  const handleInputChange = (index, value) => {
    setMcqConfig((prev) => {
      const newConfig = [...prev];
      newConfig[index] = { ...newConfig[index], count: value };
      return newConfig;
    });
  };

  const handleCreateMCQs = async () => {
    setIsCreating(true);
    const newMcqs = await generateMCQs(content, selectedOutcomes, mcqConfig);
    setMcqs((prev) => [...prev, ...newMcqs]);
    setIsCreating(false);
  };

  const handleDelete = (index) => {
    Modal.confirm({
      title: "Are you sure you want to delete this question?",
      onOk: () => setMcqs((prev) => prev.filter((_, i) => i !== index)),
    });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedQuestion({ ...mcqs[index] });
  };

  const handleSave = () => {
    setMcqs((prev) => prev.map((mcq, i) => (i === editIndex ? editedQuestion : mcq)));
    setEditIndex(null);
    setEditedQuestion({});
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditedQuestion({});
  };

  const handleChange = (field, value) => {
    setEditedQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (optionKey, value) => {
    setEditedQuestion((prev) => ({
      ...prev,
      [optionKey]: value,
    }));
  };

  const getOptions = (mcq) => {
    // Use regex to filter actual options (e.g., OPTION_1, OPTION_2) and ignore OPTION_1_ID
    const optionKeys = Object.keys(mcq).filter((key) => /^OPTION_\d+$/.test(key));
    return optionKeys.map((key) => ({
      key,
      text: mcq[key],
      isCorrect: mcq.CORRECT_OPTION === key,
    }));
  };

  return (
    <div className="create-mcqs-container">
      <Title level={2} className="page-title">Create MCQs</Title>
      <div className="mcq-config-list">
        <List
          dataSource={selectedOutcomes}
          renderItem={(outcome, index) => (
            <List.Item className="mcq-config-item">
              <Text className="mcq-outcome-label">{outcome}</Text>
              <Input
                type="number"
                min="1"
                value={mcqConfig[index]?.count || 1}
                onChange={(e) => handleInputChange(index, parseInt(e.target.value, 10))}
                className="mcq-count-input"
              />
            </List.Item>
          )}
        />
      </div>
      <Button
        type="primary"
        className="generate-btn"
        onClick={handleCreateMCQs}
        loading={isCreating}
        block
      >
        {isCreating ? 'Creating MCQs...' : 'Create MCQs'}
      </Button>

      <div className="mcq-list">
        {mcqs.map((mcq, index) => (
          <Card
            key={index}
            className="mcq-item"
            title={<Text strong>Question:</Text>}
            extra={
              editIndex === index ? null : (
                <div>
                  <Button type="link" onClick={() => handleEdit(index)}>
                    Edit
                  </Button>
                  <Button type="link" danger onClick={() => handleDelete(index)}>
                    Delete
                  </Button>
                </div>
              )
            }
          >
            {editIndex === index ? (
              <div className="mcq-edit">
                <Input.TextArea
                  value={editedQuestion.QUESTION_TEXT}
                  onChange={(e) => handleChange("QUESTION_TEXT", e.target.value)}
                  rows={3}
                  className="mcq-edit-textarea"
                />
                <div className="mcq-options-edit">
                  {getOptions(editedQuestion).map(({ key, text }) => (
                    <div key={key} className="mcq-option-edit">
                      <Input
                        value={text || ""}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        placeholder={`Edit ${key}`}
                        className="mcq-option-input"
                      />
                    </div>
                  ))}
                </div>
                <Input.TextArea
                  value={editedQuestion.EXPLANATION}
                  onChange={(e) => handleChange("EXPLANATION", e.target.value)}
                  rows={3}
                  className="mcq-edit-textarea"
                />
                <Button type="primary" onClick={handleSave} className="save-btn">
                  Save
                </Button>
                <Button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </Button>
              </div>
            ) : (
              <div>
                <p className="mcq-question"><strong>Question:</strong> {mcq.QUESTION_TEXT}</p>
                <p className="mcq-learning-outcome"><Text strong>Learning Outcome:</Text> {mcq.LEARNING_OUTCOME}</p>
                <div className="mcq-options">
                  <Text strong>Options:</Text>
                  <ul>
                    {getOptions(mcq).map(({ key, text, isCorrect }) => (
                      <li key={key} className={isCorrect ? "correct-option" : "wrong-option"}>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mcq-explanation"><Text strong>Explanation:</Text> {mcq.EXPLANATION}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CreateMCQs;
