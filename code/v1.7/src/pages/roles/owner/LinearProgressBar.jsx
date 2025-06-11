import React from 'react';

const LinearProgressBar = ({ total, current }) => {
  const calculatePercentage = () => {
    return (current / total) * 100;
  };

  const linearProgressBarStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: 'rgb(191 191 191)', // Blue color for the empty part
    borderRadius: '4px',  
    overflow: 'hidden',
  };

  const filledProgressBarStyle = {
    width: `${calculatePercentage()}%`,
    height: '100%',
    backgroundColor: 'var(--white-color)', // Orange color for the filled part
    borderRadius: '4px',
    transition: 'width 0.5s ease-in-out', // Add transition for a smooth effect
  };

  return (
    <div style={linearProgressBarStyle}>
      <div style={filledProgressBarStyle} />
    </div>
  );
};

export default LinearProgressBar;