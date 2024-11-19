import React from 'react';
import { Modal, Card } from 'react-bootstrap';

const GameStatsPopup = ({ show, onHide, stats }) => {
  if (!stats) return null;

  // Calculate percentages safely
  const safeMovePercent = stats.totalMoves > 0 
    ? ((stats.safeMoves / stats.totalMoves) * 100).toFixed(1)
    : '0.0';
  
  const riskyMovePercent = stats.totalMoves > 0
    ? ((stats.riskyMoves / stats.totalMoves) * 100).toFixed(1)
    : '0.0';

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Game Statistics</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="mb-3">
          <Card.Header>Move Analysis</Card.Header>
          <Card.Body>
            <div className="mb-3">
              <h6>Risk Analysis</h6>
              <p><strong>Total Moves:</strong> {stats.totalMoves}</p>
              <p><strong>Safe Moves (0% risk):</strong> {stats.safeMoves} ({safeMovePercent}%)</p>
              <p><strong>Risky Moves (&gt;0% risk):</strong> {stats.riskyMoves} ({riskyMovePercent}%)</p>
              <p><strong>Average Risk (risky moves only):</strong> {stats.averageRiskOfRiskyMoves}%</p>
              <p><strong>Overall Average Risk:</strong> {stats.overallAverageRisk}%</p>
            </div>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Header>Game Summary</Card.Header>
          <Card.Body>
            <p><strong>Result:</strong> {stats.success ? '🟢 Won' : '🔴 Lost'}</p>
            <p><strong>Total Time:</strong> {stats.totalTime.toFixed(1)} seconds</p>
            <p><strong>Average Time per Move:</strong> {stats.averageTimePerMove.toFixed(1)} seconds</p>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default GameStatsPopup;
