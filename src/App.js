import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import AboutModal from './components/Modal';

const numRows = 24;
const numCols = 24;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(200);
  var [generations, setGenerations] = useState(0);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, speed);
    setGenerations(generations++);
  }, []);


  const nextGeneration = useCallback(() => {
    if (!runningRef.current){
      return;
    }
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++){
          for(let j = 0; j < numCols; j++){
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols){
                neighbors += g[newI][newJ]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      })
    })

    setGenerations(generations++);

  }, [])


  const changeSpeed = e => {
    e.preventDefault();
    setSpeed(speed)
    runSimulation();
    console.log(speed)
  }

  const resetGenerations = () => {
      setGenerations(0);
  }

  const handleChange = e => {
      setSpeed(e.target.value)
  }

  return (
    <>
      <h1>Conway's Game of Life</h1>
      <div className='buttons'>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}>
        {running ? "Stop" : "Start"}
      </button>
    
      <form onSubmit={resetGenerations}>
         <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}>
        Clear
      </button> 
      </form>
      

      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}>
        Random
      </button>

      <button onClick={() => {
      setRunning(!running);
      if(!running){
        runningRef.current = true;
      nextGeneration();
      }
    }}>
      Next Generation
    </button>

    <form onSubmit={changeSpeed}>
      {/* <input
        type='number'
        min='100'
        max='1000'
        step='100'
        value={speed}
        onChange={handleChange}
        /> */}
      <button>Go faster!</button>
   
    </form>
    <AboutModal />

    </div>
      <div className='grid'
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >

      
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              className='box'
              style={{
                backgroundColor: grid[i][k] ? "gold" : undefined,
                boxShadow: grid[i][k] ? '0px 0px 5px lightblue' : undefined
              }} 
            />
          ))
        )}

        <div className='counter'>
          <h2 className='counterText'>Generations:{generations} </h2>
        </div>

      </div>
    </>
  );
};

export default App;