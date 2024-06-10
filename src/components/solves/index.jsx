import React, { forwardRef, useImperativeHandle } from 'react';
import './style.css';

const Solves = forwardRef(({ solves }, ref) => {
  // Create a map to store solves by day of the week
  const solvesByDay = {
    'Sun': undefined,
    'Mon': undefined,
    'Tue': undefined,
    'Wed': undefined,
    'Thu': undefined,
    'Fri': undefined,
    'Sat': undefined
  };

  // Map solves to solvesByDay
  solves.forEach(solve => {
    // Ensure solve.puzzle.date is a valid Date object
    const solveDate = new Date(solve.puzzle.date);
    // Get the short weekday string
    const solveDayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(solveDate);
    solvesByDay[solveDayOfWeek] = solve.success;
  });

  const getSolvesText = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysText = weekDays.join('\t');
    const emojisText = weekDays.map(day => {
      const solveSuccess = solvesByDay[day];
      if (solveSuccess !== undefined) {
        return solveSuccess ? '🟢' : '🔴';
      } else {
        return '⚪';
      }
    }).join('\t');
    return `${daysText}\n${emojisText}`;
  };

  useImperativeHandle(ref, () => ({
    getSolvesText,
  }));

  // Iterate over each day of the week
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="emojis">
      {weekDays.map(day => {
        const solveSuccess = solvesByDay[day];

        // If there's a solve for the day, display emojis based on success status
        if (solveSuccess !== undefined) {
          return (
            <div key={day}>
              <div className="day">{day}</div>
              <div title={`Solves for ${day}`} className="emoji">
                {solveSuccess ? '🟢' : '🔴'}
              </div>
            </div>
          );
        } else {
          // If there's no solve for the day, display a gray emoji
          return (
            <div key={day}>
              <div className="day">{day}</div>
              <div title={`No solve for ${day}`} className="emoji">
                ⚪
              </div>
            </div>
          );
        }
      })}
    </div>
  );
});

export default Solves;
