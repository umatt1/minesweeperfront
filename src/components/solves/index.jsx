import React from 'react';
import './style.css';

const Solves = ({ solves }) => {
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
        const solveDayOfWeek = new Date(solve.puzzle.date).toLocaleDateString('en-US', { weekday: 'short' });
        solvesByDay[solveDayOfWeek] = solve.success;
    });

    // Iterate over each day of the week
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
            <div className="emojis">
                {weekDays.map(day => {
                    const solveSuccess = solvesByDay[day];

                    // If there's a solve for the day, display emojis based on success status
                    if (solveSuccess !== undefined) {
                        return (
                            <div>
                                <div key={day} className="day">{day}</div>
                                <div key={day} title={`Solves for ${day}`} className="emoji">
                                    {solveSuccess ? '🟢' : '🔴'}
                                </div>
                            </div>
                        );
                    } else {
                        // If there's no solve for the day, display a gray emoji
                        return (
                            <div>
                                <div key={day} className="day">{day}</div>

                                <div key={day} title={`No solve for ${day}`} className="emoji">
                                    ⚪
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
    );
}

export default Solves;
