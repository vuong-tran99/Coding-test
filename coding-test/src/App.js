import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [points, setPoints] = useState([]);
  const [numPoints, setNumPoints] = useState(0);
  const [playMode, setplayMode] = useState(true);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [order, setOrder] = useState(1);
  const [result, setResult] = useState("Let's play");
  const svgWidth = 600;
  const svgHeight = 500;
  const padding = 20;

  const handleRender = () => {
    const newPoints = [];
    const maxAttempts = 1050;
    let attempts = 0;

    while (newPoints.length < numPoints && attempts < maxAttempts) {
      const x = Math.floor(Math.random() * (svgWidth - padding * 2)) + padding;
      const y = Math.floor(Math.random() * (svgHeight - padding * 2)) + padding;
      const overlaps = newPoints.some((point) => {
        const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
        return distance < 20;
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
    setOrder(1);
    setResult("Let's play")
    if (numPoints <= 0) {
      return;
    }
    handleRender();
    setplayMode(false);
    setTimer(0);
    if (intervalId) {
      clearInterval(intervalId);
    }
  
    const newIntervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 0.1);
    }, 100);
  
    setIntervalId(newIntervalId);
  
    return () => clearInterval(newIntervalId);
  };

  const handlePoint = (p) => {
    if (p.label === order) {
      const copyPoints = [...points];
      copyPoints.forEach((point, index) => {
        if (point.id === p.id) {
          copyPoints[index] = { ...point, activate: true };
        }
      });
  
      setOrder(p.label + 1)
      setPoints(copyPoints)

      if (p.label == numPoints) {
        const timer = setTimeout(() => {
          setResult("All Cleared");
          clearInterval(intervalId);
        }, 2000);
      }
    } else {
      clearInterval(intervalId);
      setResult("Game over")
      return;
    }
  };

  return (
    <div className="App">
       <div>
        {
          result === "Let's play" ? <h3>{ result }</h3> : <h3 className={ result === "Game over" ? 'lose' : 'win'}>{ result }</h3>
        }
         <div className="point">
           <div className='labelPoint'>Points</div>
           <input type='number' value={numPoints} onChange={handleInputChange} />
         </div>
         <div className="time">
           <div className='labelTime'>Time</div>
           <div>{timer.toFixed(1)}</div>
         </div>
         <button className='btnPlay' onClick={handleButtonClick}>{playMode ? 'Play' : 'Restart'}</button>
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
