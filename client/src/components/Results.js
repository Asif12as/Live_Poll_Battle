// client/src/components/Results.js
import React from 'react';

function Results({ room }) {
  const totalVotes = room.options.option1.votes + room.options.option2.votes;
  
  const option1Percentage = totalVotes === 0 
    ? 0 
    : Math.round((room.options.option1.votes / totalVotes) * 100);
  
  const option2Percentage = totalVotes === 0 
    ? 0 
    : Math.round((room.options.option2.votes / totalVotes) * 100);
  
  return (
    <div className="results">
      <h3>Live Results (Total Votes: {totalVotes})</h3>
      
      <div className="result-bar">
        <div className="option-label">{room.options.option1.text}</div>
        <div className="bar-container">
          <div 
            className="bar" 
            style={{ width: `${option1Percentage}%` }}
          ></div>
          <span className="percentage">{option1Percentage}%</span>
        </div>
        <div className="vote-count">{room.options.option1.votes} votes</div>
      </div>
      
      <div className="result-bar">
        <div className="option-label">{room.options.option2.text}</div>
        <div className="bar-container">
          <div 
            className="bar" 
            style={{ width: `${option2Percentage}%` }}
          ></div>
          <span className="percentage">{option2Percentage}%</span>
        </div>
        <div className="vote-count">{room.options.option2.votes} votes</div>
      </div>
    </div>
  );
}

export default Results;