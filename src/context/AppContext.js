import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [content, setContent] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState([]);
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [mcqConfig, setMcqConfig] = useState([]);
  const [mcqs, setMcqs] = useState([]);

  return (
    <AppContext.Provider
      value={{
        content,
        setContent,
        learningOutcomes,
        setLearningOutcomes,
        selectedOutcomes,
        setSelectedOutcomes,
        mcqConfig,
        setMcqConfig,
        mcqs,
        setMcqs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);