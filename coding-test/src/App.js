import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [points, setPoints] = useState([]);
  const [numPoints, setNumPoints] = useState(0);
  const [playMode, setplayMode] = useState(true);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [order, setOrder] = useState(0);
  const svgWidth = 1280;
  const svgHeight = 500;
  const padding = 20; // Khoảng cách từ các điểm tới cạnh SVG

  const handleRender = () => {
    const newPoints = [];
    const maxAttempts = 1050;
    let attempts = 0;

    while (newPoints.length < numPoints && attempts < maxAttempts) {
      const x = Math.floor(Math.random() * (svgWidth - padding * 2)) + padding;
      const y = Math.floor(Math.random() * (svgHeight - padding * 2)) + padding;
      const overlaps = newPoints.some((point) => {
        const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
        return distance < 20; // Minimum distance between points is 20
      });

      if (!overlaps) {
        newPoints.push({ id: uuidv4(), x, y, label: newPoints.length + 1, activate: false });
      }
      attempts++;
    }

    console.log(newPoints)

    setPoints(newPoints);
  }

  const handleInputChange = (event) => {
    setNumPoints(event.target.value);
  };
    
  const handleButtonClick = () => {
    if (numPoints <= 0) {
      return;
    }
    handleRender();
    // setShowPoints(true);
    setplayMode(false);
    setTimer(0);
    if (intervalId) {
      clearInterval(intervalId);
    }
  
    const newIntervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 0.1);
    }, 100);
  
    setIntervalId(newIntervalId);
  
    // Return a cleanup function to clear the interval when the component unmounts
    return () => clearInterval(newIntervalId);
  };

  const handlePoint = (p) => {
    if (p.label < order) {
      console.log(p.label)
      return;
    }
    const copyPoints = [...points];
    copyPoints.forEach((point, index) => {
      if (point.id === p.id) {
        copyPoints[index] = { ...point, activate: true };
      }
    });
    setOrder(p.label)

    setPoints(copyPoints)
  };

  return (
    <div className="App">
       <div>
         <h3>Let's play</h3>
         <div className="point">
           <div>Points</div>
           <input type='number' value={numPoints} onChange={handleInputChange} />
         </div>
         <div className="time">
           <div>Time</div>
           <div>{timer.toFixed(1)}</div>
         </div>
         <button onClick={handleButtonClick}>{playMode ? 'Play' : 'Restart'}</button>
       </div>

       <div style={{ width: `${svgWidth}px`, height: `${svgHeight}px`, border: `1px solid black` }}>
          <svg width={`100%`} height={`100%`} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {points.map((point, index) => (
              <g key={index} className={ point.activate ? 'hidden' : ''}>
                <circle
                  onClick={() => handlePoint(point)}
                  cx={point.x}
                  cy={point.y}
                  r="20"
                  fill= {point.activate ? "red" : "white"}
                  stroke="black" 
                  stroke-width="1"
                />
                <text
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="16"
                  fill="black"
                  style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
     </div>
  );
}

export default App;
