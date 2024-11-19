import React from 'react';
import { Modal, Card } from 'react-bootstrap';

const GameStatsPopup = ({ show, onHide, stats }) => {
  if (!stats) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Game Statistics</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="mb-3">
          <Card.Header>Move Analysis</Card.Header>
          <Card.Body>
            <p><strong>Total Moves:</strong> {stats.totalMoves}</p>
            <p><strong>Uncertain Moves:</strong> {stats.uncertainMoves} ({((stats.uncertainMoves / stats.totalMoves) * 100).toFixed(1)}%)</p>
            <p><strong>Average Time per Move:</strong> {stats.averageTimePerMove.toFixed(1)} seconds</p>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Header>Game Summary</Card.Header>
          <Card.Body>
            <p><strong>Result:</strong> {stats.success ? '🟢 Won' : '🔴 Lost'}</p>
            <p><strong>Total Time:</strong> {stats.totalTime.toFixed(1)} seconds</p>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default GameStatsPopup;
