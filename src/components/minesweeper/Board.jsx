import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Cell from './Cell';
import SolveApi from '../apis/SolveApi';
import { useCookies } from 'react-cookie';

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
      console.log('Selected safe spot:', safeTiles[randomIndex]);
    } else {
      console.log('No safe spot needed:', has2 ? 'value 2 exists' : 'no safe tiles found');
    }
  }, [layout]);

  function getMoveType(row, col) {
    // First move or safe start spot is always safe
    if (moveHistory.length === 0 || (safeStartSpot && safeStartSpot[0] === row && safeStartSpot[1] === col)) {
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
      
      // Track the move
      setMoveHistory(prev => [...prev, {
        row,
        col,
        type: 'reveal',
        moveType,
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
      setMoveHistory(prev => [...prev, {
        row,
        col,
        type: 'flag',
        moveType,
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
      setGameState(success ? 'win' : 'lose');
      setEndTime(end);

      // Calculate game statistics
      const totalTime = (end - startTime) / 1000;
      const moveTypes = moveHistory.reduce((acc, move) => {
        acc[move.moveType] = (acc[move.moveType] || 0) + 1;
        return acc;
      }, {});

      const gameStats = {
        totalMoves: moveHistory.length,
        blindGuesses: moveTypes.blind_guess || 0,
        adjacentToNumber: moveTypes.adjacent_to_number || 0,
        adjacentToEmpty: moveTypes.adjacent_to_empty || 0,
        safeStarts: moveTypes.safe_start || 0,
        averageTimePerMove: moveHistory.length > 0 
          ? moveHistory.reduce((sum, move) => sum + move.time, 0) / moveHistory.length 
          : 0,
        totalTime,
        success
      };

      api.postSolve({
        username: cookies.username,
        puzzleId: puzzleId,
        time: totalTime,
        success,
        moves: moveHistory,
        jwt: cookies.jwt
      }, cookies.jwt);

      onSolveComplete({
        success,
        time: totalTime,
        stats: gameStats
      });

      if (hitMine) return;
    }
  }

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
    const mineCount = surroundingMines(row, col, layout);
    const flagCount = countSurroundingFlags(row, col);
    
    // Only chord if the number of flags matches the number on the cell
    if (mineCount === flagCount) {
      // Reveal all non-flagged surrounding cells
      for (let i = row-1; i < row+2; i++) {
        for (let j = col-1; j < col+2; j++) {
          if (i < 0 || j < 0 || i >= layout.length || j >= layout[0].length) {
            continue;
          }
          if (!flaggedCells.includes(`${i}-${j}`)) {
            revealChunk(i, j);
          }
        }
      }
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
