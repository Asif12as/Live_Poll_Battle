import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
);

function PollAnalytics({ room }) {
  const [voteHistory, setVoteHistory] = useState([]);
  const [userStats, setUserStats] = useState({ total: 0, voted: 0, notVoted: 0 });
  
  useEffect(() => {
    // Add current vote data to history with timestamp
    if (room && room.options) {
      const newDataPoint = {
        timestamp: new Date().toLocaleTimeString(),
        option1Votes: room.options.option1.votes,
        option2Votes: room.options.option2.votes
      };
      
      setVoteHistory(prev => [...prev, newDataPoint]);
      
      // Update user participation stats
      const users = Object.values(room.users || {});
      const totalUsers = users.length;
      const votedUsers = users.filter(user => user.voted).length;
      
      setUserStats({
        total: totalUsers,
        voted: votedUsers,
        notVoted: totalUsers - votedUsers
      });
    }
  }, [room?.options?.option1?.votes, room?.options?.option2?.votes]);
  
  if (!room || !room.options) {
    return <div>Loading analytics...</div>;
  }
  
  // Bar chart data
  const barData = {
    labels: [room.options.option1.text, room.options.option2.text],
    datasets: [
      {
        label: 'Votes',
        data: [room.options.option1.votes, room.options.option2.votes],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };
  
  // Pie chart data
  const pieData = {
    labels: [room.options.option1.text, room.options.option2.text],
    datasets: [
      {
        data: [room.options.option1.votes, room.options.option2.votes],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };
  
  // Line chart data (vote trend)
  const lineData = {
    labels: voteHistory.map(data => data.timestamp),
    datasets: [
      {
        label: room.options.option1.text,
        data: voteHistory.map(data => data.option1Votes),
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1
      },
      {
        label: room.options.option2.text,
        data: voteHistory.map(data => data.option2Votes),
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1
      }
    ],
  };
  
  // User participation pie chart
  const userPieData = {
    labels: ['Voted', 'Not Voted'],
    datasets: [
      {
        data: [userStats.voted, userStats.notVoted],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(201, 203, 207, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(201, 203, 207, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analytics-dashboard">
      <h2>Real-time Poll Analytics</h2>
      
      <div className="analytics-grid">
        <div className="chart-container">
          <h3>Current Vote Distribution</h3>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        
        <div className="chart-container">
          <h3>Vote Percentage</h3>
          <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        
        <div className="chart-container wide">
          <h3>Vote Trend Over Time</h3>
          <Line 
            data={lineData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              } 
            }} 
          />
        </div>
        
        <div className="chart-container">
          <h3>User Participation</h3>
          <Pie data={userPieData} options={{ responsive: true, maintainAspectRatio: false }} />
          <div className="stat-summary">
            <p><strong>Total Users:</strong> {userStats.total}</p>
            <p><strong>Participation Rate:</strong> {userStats.total ? Math.round((userStats.voted / userStats.total) * 100) : 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollAnalytics;