import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Cell from './Cell';
import SolveApi from '../apis/SolveApi';
import { useCookies } from 'react-cookie';
import { generateProbability } from '../probabilityEngine/ProbabilityEngine';

const api = new SolveApi();

const Board = ({ layout, puzzleId, onSolveComplete, mines }) => {
  const [revealedCells, setRevealedCells] = useState([]);
  const [flaggedCells, setFlaggedCells] = useState([]);
  const [gameState, setGameState] = useState('not started');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [safeStartSpot, setSafeStartSpot] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveStartTime, setMoveStartTime] = useState(null);
  const [moveStats, setMoveStats] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);

  // Find a safe starting spot when component mounts
  useEffect(() => {
    // Check if a value 2 exists
    let has2 = false;
    let safeTiles = [];
    layout.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        if (tile === 2) has2 = true;
        if (tile === 0 && surroundingMines(rowIndex, colIndex, layout) === 0) {
          safeTiles.push([rowIndex, colIndex]);
        }
      });
    });

    // If no value 2 exists, randomly select a safe tile
    if (!has2 && safeTiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * safeTiles.length);
      setSafeStartSpot(safeTiles[randomIndex]);
    } 
  }, [layout]);

  useEffect(() => {
    if (layout && layout.length > 0) {
      // Assuming layout is a 2D array representing the mine grid
      generateProbability(false);
    }
  }, [layout]);

  function getMoveType(row, col) {
    // First move or safe start spot is always safe
    if (safeStartSpot && safeStartSpot[0] === row && safeStartSpot[1] === col) {
      return 'safe_start';
    }

    // Check if adjacent to any revealed cells
    let hasRevealedNeighbor = false;
    let hasNumberedNeighbor = false;

    for (let i = row-1; i < row+2; i++) {
      for (let j = col-1; j < col+2; j++) {
        if (i < 0 || j < 0 || i >= layout.length || j >= layout[0].length || (i === row && j === col)) {
          continue;
        }

        const cellKey = `${i}-${j}`;
        if (revealedCells.includes(cellKey)) {
          hasRevealedNeighbor = true;
          // Check if the revealed neighbor has a number
          const neighborMines = surroundingMines(i, j, layout);
          if (neighborMines > 0) {
            hasNumberedNeighbor = true;
          }
        }
      }
    }

    if (!hasRevealedNeighbor) {
      return 'blind_guess';
    } else if (hasNumberedNeighbor) {
      return 'adjacent_to_number';
    } else {
      return 'adjacent_to_empty';
    }
  }

  // Function to record a move's probability
  const recordMove = (row, col) => {
    const probability = calculateMineProbability(row, col);
    console.log(`Move at ${row},${col} - Probability: ${probability}`);
    setMoveStats(prev => [...prev, { probability }]);
    return probability;
  };

  function revealCellFactory(row, col) {
    return () => {
      // Start timing this move
      if (!moveStartTime) {
        setMoveStartTime(new Date());
      }

      // If the cell is already revealed and has a number, try chording
      if (revealedCells.includes(`${row}-${col}`)) {
        const mineCount = surroundingMines(row, col, layout);
        if (mineCount > 0) {
          handleChording(row, col);
          return;
        }
      }

      const moveTime = new Date() - moveStartTime;
      const moveType = getMoveType(row, col);
      const probability = recordMove(row, col);
      
      // Track the move
      setMoveHistory(prev => [...prev, {
        row,
        col,
        type: 'reveal',
        moveType,
        probability,
        time: moveTime / 1000 // Convert to seconds
      }]);

      // Reset move timer
      setMoveStartTime(new Date());

      revealChunk(row, col);
    };
  }

  function flagCellFactory(row, col, isFlagged) {
    return () => {
      const moveTime = moveStartTime ? (new Date() - moveStartTime) / 1000 : 0;
      const moveType = getMoveType(row, col);
      
      // Track the move
      const probability = calculateMineProbability(row, col);
      setMoveStats(prev => [...prev, { probability }]);
      
      setMoveHistory(prev => [...prev, {
        row,
        col,
        type: 'flag',
        moveType,
        probability,
        time: moveTime
      }]);

      // Reset move timer
      setMoveStartTime(new Date());

      if (!isFlagged) {
        setFlaggedCells([...flaggedCells, `${row}-${col}`])
      } else {
        const toRemove = flaggedCells.indexOf(`${row}-${col}`)
        setFlaggedCells([...flaggedCells.slice(0, toRemove), ...flaggedCells.slice(toRemove+1, flaggedCells.length)])
      }
    }
  }

  function manageGameState() {
    if (gameState === 'not started') {
      setStartTime(new Date())
      setGameState('in progress')
      setMoveStartTime(new Date())
    }

    let mineCount = 0;
    let squareCount = 0;
    let hitMine = false;
    layout.forEach(row => {
      row.forEach(tile => {
        if (tile === 1) mineCount += 1;
        squareCount += 1;
      });
    });
    revealedCells.forEach(cell => {
      const [row, col] = cell.split('-').map(Number);
      if (layout[row][col] === 1) {
        hitMine = true;
      }
    })

    if (hitMine || revealedCells.length === squareCount - mineCount) {
      const end = new Date();
      const success = !hitMine;
      handleGameOver(success);
    }
  }

  const handleGameOver = (success) => {
    setGameState(success ? 'win' : 'lose');
    setEndTime(Date.now());
    const stats = getGameStats();
    onSolveComplete({
      success,
      time: ((Date.now() - startTime) / 1000).toFixed(2),
      stats
    });
  };

  useEffect(() => {
    manageGameState()
  }, [revealedCells]);

  function countSurroundingFlags(row, col) {
    let count = 0;
    for (let i = row-1; i < row+2; i++) {
      for (let j = col-1; j < col+2; j++) {
        if (i < 0 || j < 0 || i >= layout.length || j >= layout[0].length) {
          continue;
        }
        if (flaggedCells.includes(`${i}-${j}`)) {
          count++;
        }
      }
    }
    return count;
  }

  function handleChording(row, col) {
    const flagCount = countSurroundingFlags(row, col);
    const mineCount = surroundingMines(row, col, layout);
    
    if (flagCount === mineCount) {
      // Record probabilities for all unrevealed neighbors being revealed by chord
      const unrevealedNeighbors = [];
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r === row && c === col) continue;
          if (r < 0 || c < 0 || r >= layout.length || c >= layout[0].length) continue;
          
          const key = `${r}-${c}`;
          if (!revealedCells.includes(key) && !flaggedCells.includes(key)) {
            unrevealedNeighbors.push([r, c]);
          }
        }
      }
      
      // Record each unrevealed neighbor as a move
      unrevealedNeighbors.forEach(([r, c]) => {
        const probability = recordMove(r, c);
        const moveTime = new Date() - moveStartTime;
        setMoveHistory(prev => [...prev, {
          row: r,
          col: c,
          type: 'reveal',
          moveType: getMoveType(r, c),
          probability,
          time: moveTime / 1000
        }]);
      });
      
      // Reveal all non-flagged neighbors
      unrevealedNeighbors.forEach(([r, c]) => revealChunk(r, c));
    }
  }

  function revealChunk(row, col) {
    if (revealedCells.includes(`${row}-${col}`) || row < 0 || col < 0 || row >= layout.length || col >= layout.at(0).length || flaggedCells.includes(`${row}-${col}`)) {
      return;
    }
    const touched = revealedCells.slice(0, revealedCells.length);
    touched.push(`${row}-${col}`)
    const stack = [];
    if ((layout[row][col] === 0 || layout[row][col] === 2) && surroundingMines(row, col, layout) === 0) {
      stack.push({row: row, col: col});
    }
    while (stack.length > 0) {
      const center = stack.pop();
      for (let r = center.row-1; r < center.row+2; r++) {
        for (let c = center.col-1; c < center.col+2; c++) {
          if (touched.includes(`${r}-${c}`) || r < 0 || c < 0 || r >= layout.length || c >= layout.at(0).length || flaggedCells.includes(`${r}-${c}`)) {
            continue;
          }
          if (layout[r][c] === 1) {
            continue;
          }
          touched.push(`${r}-${c}`)
          if (surroundingMines(r,c,layout) === 0) {
            stack.push({row: r, col: c});
          }
        }
      }
    }
    setRevealedCells(touched);
  }

  const surroundingMines = (row, col, layout) => {
    let count = 0;
    for (let i = row-1; i < row+2; i += 1) {
        for (let j = col-1; j < col+2; j += 1) {
            if (i < 0 || j < 0 || i >= layout.length || j >= layout.at(0).length) {
                continue
            }
            else if (layout.at(i).at(j) === 1) {
                count += 1;
            }
        }
    }
    return count;
  }

  const calculateMineProbability = (row, col) => {
    // Pretty print the current board state
    console.log('\n=== Calculating Probability for tile:', row, col, '===');
    console.log('Current Board State:');
    let boardString = '';
    for (let i = 0; i < layout.length; i++) {
      let rowString = '';
      for (let j = 0; j < layout[i].length; j++) {
        if (revealedCells.includes(`${i}-${j}`)) {
          rowString += ` ${layout[i][j]} `;
        } else if (flaggedCells.includes(`${i}-${j}`)) {
          rowString += ' F ';
        } else {
          rowString += ' · ';
        }
      }
      boardString += rowString + '\n';
    }
    console.log(boardString);

    // If already revealed or flagged, return null
    if (revealedCells.includes(`${row}-${col}`) || flaggedCells.includes(`${row}-${col}`)) {
      console.log('Tile is already revealed or flagged');
      return null;
    }

    // Get all unrevealed neighbors and revealed neighbors
    const unrevealedNeighbors = [];
    const revealedNeighborCounts = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (newRow >= 0 && newRow < layout.length && newCol >= 0 && newCol < layout[0].length) {
        if (revealedCells.includes(`${newRow}-${newCol}`)) {
          // Store revealed neighbor's mine count
          revealedNeighborCounts.push({
            row: newRow,
            col: newCol,
            count: layout[newRow][newCol]
          });
        } else if (!flaggedCells.includes(`${newRow}-${newCol}`)) {
          // Store unrevealed and unflagged neighbor
          unrevealedNeighbors.push({
            row: newRow,
            col: newCol
          });
        }
      }
    }

    console.log('Revealed neighbors with counts:', revealedNeighborCounts);
    console.log('Unrevealed neighbors:', unrevealedNeighbors);

    // If no revealed neighbors with numbers, use basic probability
    if (revealedNeighborCounts.length === 0) {
      const totalUnrevealed = layout.length * layout[0].length - revealedCells.length - flaggedCells.length;
      const remainingMines = mines - flaggedCells.length;
      console.log('No revealed neighbors, using basic probability:');
      console.log(`Remaining mines: ${remainingMines}, Total unrevealed: ${totalUnrevealed}`);
      return remainingMines / totalUnrevealed;
    }

    // Count valid configurations where this cell has a mine
    let validConfigsWithMine = 0;
    let totalValidConfigs = 0;

    // Generate all possible mine configurations for unrevealed neighbors
    const maxConfigs = Math.min(1 << (unrevealedNeighbors.length + 1), 1000); // +1 for target tile
    console.log(`Testing ${maxConfigs} possible configurations...`);
    
    for (let config = 0; config < maxConfigs; config++) {
      const mineLocations = new Set();
      
      // Convert binary number to mine locations, including target tile
      for (let i = 0; i <= unrevealedNeighbors.length; i++) {
        if ((config & (1 << i)) !== 0) {
          if (i === unrevealedNeighbors.length) {
            // Last bit represents target tile
            mineLocations.add(`${row}-${col}`);
          } else {
            const neighbor = unrevealedNeighbors[i];
            mineLocations.add(`${neighbor.row}-${neighbor.col}`);
          }
        }
      }

      console.log(`\nTesting configuration ${config}:`);
      console.log('Mine locations:', Array.from(mineLocations));

      // Check if this configuration is valid
      let isValid = true;
      for (const revealed of revealedNeighborCounts) {
        let mineCount = 0;
        console.log(`Checking revealed tile at ${revealed.row},${revealed.col} (count: ${revealed.count})`);
        
        // Count mines around this revealed cell
        for (const [dx, dy] of directions) {
          const checkRow = revealed.row + dx;
          const checkCol = revealed.col + dy;
          if (checkRow >= 0 && checkRow < layout.length && checkCol >= 0 && checkCol < layout[0].length) {
            const key = `${checkRow}-${checkCol}`;
            if (mineLocations.has(key) || flaggedCells.includes(key)) {
              mineCount++;
            }
          }
        }
        console.log(`Found ${mineCount} mines around revealed tile ${revealed.row},${revealed.col}`);
        
        if (mineCount !== revealed.count) {
          console.log(`Invalid configuration: Expected ${revealed.count} mines, found ${mineCount}`);
          isValid = false;
          break;
        }
      }

      if (isValid) {
        console.log('Valid configuration found!');
        totalValidConfigs++;
        if (mineLocations.has(`${row}-${col}`)) {
          validConfigsWithMine++;
        }
      }
    }

    const probability = totalValidConfigs === 0 ? 0 : validConfigsWithMine / totalValidConfigs;
    console.log(`\nFinal Results:`);
    console.log(`Valid configurations: ${totalValidConfigs}`);
    console.log(`Valid configurations with mine: ${validConfigsWithMine}`);
    console.log(`Final probability: ${probability}`);
    console.log('=== End Calculation ===\n');
    
    return probability;
  };

  const renderCell = (value, row, col, layout, clickable=true) => {
    const isRevealed = revealedCells.includes(`${row}-${col}`) || ["win", "lose"].includes(gameState);
    const isFlagged = flaggedCells.includes(`${row}-${col}`);
    const isRandomSafeSpot = safeStartSpot && safeStartSpot[0] === row && safeStartSpot[1] === col;
    
    // Show value 2 for safe spots (either original or random) before revealing
    // After revealing, treat them as value 0
    const effectiveValue = isRevealed ? 
      (value === 2 || (isRandomSafeSpot && value === 0) ? 0 : value) :
      (isRandomSafeSpot ? 2 : value);
    
    const revealer = clickable ? revealCellFactory(row, col) : () => {};
    const flagger = flagCellFactory(row, col, isFlagged);

    return (
      <Cell
        key={`${row}-${col}`}
        value={effectiveValue}
        isRevealed={isRevealed}
        onClick={revealer}
        surrounding={surroundingMines(row, col, layout)}
        isFlagged={isFlagged}
        onRightClick={flagger}
      />
    );
  };

  const renderBoard = (clickable=true) => {
    return layout.map((row, rowIndex) => (
      <Row key={rowIndex} className="g-0 justify-content-center">
        {row.map((cell, columnIndex) => (
          <Col key={`${rowIndex}-${columnIndex}`} className="p-0">
            {renderCell(cell, rowIndex, columnIndex, layout, clickable)}
          </Col>
        ))}
      </Row>
    ))
  }

  const getGameStateAlert = () => {
    if (gameState === 'win') {
      return (
        <Alert variant="success" className="mt-3 text-center">
          <Alert.Heading>You Won! 🎉</Alert.Heading>
          <p className="mb-0">Time: {((endTime-startTime)/ 1000).toFixed(2)} seconds</p>
        </Alert>
      );
    } else if (gameState === 'lose') {
      return (
        <Alert variant="danger" className="mt-3 text-center">
          <Alert.Heading>Game Over 💥</Alert.Heading>
          <p className="mb-0">Time: {((endTime-startTime)/ 1000).toFixed(2)} seconds</p>
        </Alert>
      );
    }
    return null;
  };

  const getGameStats = () => {
    // Filter out moves with undefined probability and convert to numbers
    const moves = moveStats
      .filter(move => move.probability !== undefined)
      .map(move => ({ ...move, probability: Number(move.probability) }));
    
    console.log('All moves:', moves);
    
    // Count moves with probability > 0
    const riskyMoves = moves.filter(move => move.probability > 0);
    const safeMoves = moves.filter(move => move.probability === 0);
    
    console.log('Risky moves:', riskyMoves);
    console.log('Safe moves:', safeMoves);
    
    // Calculate averages
    const averageRiskOfRiskyMoves = riskyMoves.length > 0
      ? (riskyMoves.reduce((sum, move) => sum + move.probability, 0) / riskyMoves.length * 100).toFixed(1)
      : '0';
      
    const overallAverageRisk = moves.length > 0
      ? (moves.reduce((sum, move) => sum + move.probability, 0) / moves.length * 100).toFixed(1)
      : '0';

    console.log('Stats calculated:', {
      totalMoves: moves.length,
      safeMoves: safeMoves.length,
      riskyMoves: riskyMoves.length,
      averageRiskOfRiskyMoves,
      overallAverageRisk
    });

    return {
      totalMoves: moves.length || 0,  // Ensure we never return undefined
      safeMoves: safeMoves.length || 0,
      riskyMoves: riskyMoves.length || 0,
      averageRiskOfRiskyMoves,
      overallAverageRisk,
      averageTimePerMove: moveHistory.length > 0 
        ? moveHistory.reduce((sum, move) => sum + move.time, 0) / moveHistory.length 
        : 0,
      totalTime: (endTime - startTime) / 1000,
      success: gameState === 'win'
    };
  };

  return (
    <Container fluid className="p-3">
      <div className="d-flex flex-column align-items-center">
        <div className="mb-3">
          <Alert variant="info" className="text-center py-2">
            Mines Left: {mines - flaggedCells.length}
          </Alert>
        </div>
        <div style={{ maxWidth: '600px' }}>
          {renderBoard(gameState === 'not started' || gameState === 'in progress')}
        </div>
        {getGameStateAlert()}
      </div>
    </Container>
  );
};

export default Board;
