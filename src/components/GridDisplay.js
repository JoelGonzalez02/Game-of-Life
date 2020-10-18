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


const GridDisplay = () => {


  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  })

  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(200);

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

   
 
    setTimeout(runSimulation, speed);
  }, [])

  const handleChange = e => {
    setSpeed(e.target.value
    )
  }

  const changeSpeed = e => {
    e.preventDefault();
    setSpeed(speed)
    runSimulation();
  }


  return (
    <>
    <h1>Game of Life</h1>
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

    <form onSubmit={changeSpeed}>
      <input
        type='number'
        name='speed'
        step='100'
        id='speed'
        value={speed}
        onChange={handleChange}
        />
      <button>Change Speed(ms)</button>
    </form>

    {/* <NumberForm setSpeed={setSpeed} speed={speed} runSimulation={runSimulation}/> */}

    </div>

    {/* Grid display */}
    <div className='grid'style={{
      display: 'grid', 
      gridTemplateColumns: `repeat(${numCols}, 20px)`,
      justifyContent: 'center',
      margin: '0 auto',
      backgroundColor: 'purple',
      width: '36%',
    
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
          backgroundColor: grid[i][j] ? 'gold' : undefined}}/>))}
    </div>
    </>
  )

}

export default GridDisplay;