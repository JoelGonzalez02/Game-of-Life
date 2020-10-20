import React, {useState, useEffect, useCallback, useRef} from 'react';
import produce from 'immer';
import NumberForm from './SetSpeed';


const numRows = 24;
const numCols = 24;

const operations = [
  [0, 1],
  [0 -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
]

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++){
    rows.push(Array.from(Array(numCols), () => 0))
  }

  return rows
}

const changeGridSize = () => {
  const row = []
  const numRow = 40
  const numCol = 40
  for (let i = 0; i <numRow; i++){
    row.push(Array.from(Array(numCol), () => 0))
  }

  return row
}


const GridDisplay = () => {


  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  })

  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(200);
  var [generations, setGenerations] = useState(0);

  const runningRef = useRef(running);
  runningRef.current = running


  const runSimulation = useCallback(() => {
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

    setTimeout(runSimulation, speed)
    setGenerations(generations++)
  }, [])


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


  const handleChange = e => {
    setSpeed(e.target.value)
  }

  const changeSpeed = e => {
    e.preventDefault();
    setSpeed(speed)
    runSimulation();
    console.log(speed)
  }

  


  return (
    <>
    <h1>Conway's Game of Life</h1>
    {/* //Buttons */}
    <div className='buttons'>
    <button onClick={() => {
      setRunning(!running);
      if(!running){
        runningRef.current = true;
        runSimulation();
      }
    }}>
      {running ? 'Stop' : 'Start'}</button>
    
    <button onClick={() => {
      setGrid(generateEmptyGrid());
      setGenerations(0);
    }}>
      Clear
    </button>

    <button onClick={() => {
      const rows = [];
      for (let i = 0; i < numRows; i++){
       rows.push(Array.from(Array(numCols), () => Math.random() > 0.7 ? 1 : 0))
      }
    
      setGrid(rows)
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

    {/* <button onClick={() => {
      setGrid(changeGridSize());
    }}>40x40 Grid</button> */}

    <form onSubmit={changeSpeed}>
      {/* <input
        type='range'
        min='50'
        max='1000'
        step='50'
        value={speed}
        onChange={handleChange}
        /> */}
      <button>Go faster!</button>
    </form>


    </div>

    {/* Grid display */}
    <div className='grid'style={{
      display: 'grid', 
      gridTemplateColumns: `repeat(${numCols}, 20px)`,
      justifyContent: 'center',
      margin: '0 auto',
      backgroundColor: 'purple',
      width: '36.2%',
    
    }}>
      
      {grid.map((rows, i) => rows.map((col, j) => 
        <div 
        key={`${i}-${j}`}
        onClick={() => {
          const newGrid = produce(grid, gridCopy => {
            gridCopy[i][j] = grid[i][j] ? 0 : 1;
          });
          setGrid(newGrid)
        }}
        className='box'
        style={{
          boxShadow: grid[i][j] ? '0px 0px 5px lightblue' : undefined,
          backgroundColor: grid[i][j] ? 'gold' : undefined}}/>))}


        <div className='counter' >
          <h2>Generations:{generations} </h2> 
        </div>
        

        
    </div>
    </>
  )

}

export default GridDisplay;
