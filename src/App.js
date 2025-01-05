import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import GenerateLearningOutcomes from './pages/GenerateLearningOutcomes';
import CreateMCQs from './pages/CreateMCQs';
import "./App.css";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate-learning-outcomes" element={<GenerateLearningOutcomes />} />
          <Route path="/create-mcqs" element={<CreateMCQs />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
