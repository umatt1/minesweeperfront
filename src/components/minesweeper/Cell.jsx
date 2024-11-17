import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const Cell = ({ value, isRevealed, onClick, surrounding, isFlagged, onRightClick }) => {
  const [timer, setTimer] = useState(null);

  function handleContextMenu(event) {
    event.preventDefault();
    onRightClick();
  }

  function handleMouseDown(event) {
    if (event.button === 0) {
      setTimer(setTimeout(() => {
        onRightClick();
      }, 150));
    }
  }

  function handleMouseUp() {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  }

  function handleTouchStart() {
    setTimer(setTimeout(() => {
      onRightClick();
    }, 500));
  }

  function handleTouchEnd() {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  }

  function tileValue(isRevealed, surrounding, isFlagged) {
    if (isRevealed) {
      return value === 1 ? '💣' : surrounding || ' ';
    } else if (isFlagged) {
      return '🚩';
    } else {
      return ' ';
    }
  }

  // Determine button variant based on state
  const getVariant = () => {
    if (isRevealed) {
      if (value === 1) return 'danger';
      return 'light';
    }
    return 'secondary';
  };

  return (
    <Button
      variant={getVariant()}
      className="cell p-2 m-0 d-flex align-items-center justify-content-center"
      style={{ 
        width: '40px', 
        height: '40px',
        fontSize: '1.2rem',
        fontWeight: surrounding > 0 ? 'bold' : 'normal',
        color: isRevealed && surrounding > 0 ? `var(--bs-${getNumberColor(surrounding)})` : 'inherit'
      }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {tileValue(isRevealed, surrounding, isFlagged)}
    </Button>
  );
};

// Function to get color for numbers
const getNumberColor = (num) => {
  const colors = {
    1: 'primary',   // blue
    2: 'success',   // green
    3: 'danger',    // red
    4: 'info',      // light blue
    5: 'warning',   // yellow
    6: 'secondary', // gray
    7: 'dark',      // dark gray
    8: 'black'      // black
  };
  return colors[num] || 'dark';
};

export default Cell;
