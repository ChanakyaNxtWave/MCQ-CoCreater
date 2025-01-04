import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [content, setContent] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState([]);
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);

  return (
    <AppContext.Provider
      value={{
        content,
        setContent,
        learningOutcomes,
        setLearningOutcomes,
        selectedOutcomes,
        setSelectedOutcomes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);