import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Learning Outcomes Generator</h1>
      <button onClick={() => navigate('/create-mcqs')}>Create MCQs</button>
      <button disabled>Add Workflow</button>
      <button disabled>Update Workflow</button>
    </div>
  );
};

export default HomePage;