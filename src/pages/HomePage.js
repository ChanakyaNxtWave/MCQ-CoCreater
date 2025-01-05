import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">MCQ Co-Creater</h1>
      <div className="button-group">
        <button className="btn" onClick={() => navigate('/generate-learning-outcomes')}>Create MCQs</button>
        <button className="btn disabled" disabled>Add Workflow</button>
        <button className="btn disabled" disabled>Update Workflow</button>
      </div>
    </div>
  );
};

export default HomePage;