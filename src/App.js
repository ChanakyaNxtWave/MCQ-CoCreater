import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import CreateMCQs from './pages/CreateMCQs';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-mcqs" element={<CreateMCQs />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;