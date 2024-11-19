import React from 'react';
import { Modal, Card, ProgressBar } from 'react-bootstrap';

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
            <div className="mb-3">
              <h6>Risk Analysis</h6>
              <p><strong>Average Guess Risk:</strong> {stats.averageGuessRisk}% chance of mine</p>
              <ProgressBar>
                <ProgressBar variant="success" now={stats.averageGuessRisk ? (100 - parseFloat(stats.averageGuessRisk)) : 100} 
                           label={`Safe ${stats.averageGuessRisk ? (100 - parseFloat(stats.averageGuessRisk)).toFixed(1) : 100}%`} />
                <ProgressBar variant="danger" now={stats.averageGuessRisk ? parseFloat(stats.averageGuessRisk) : 0} 
                           label={`Risk ${stats.averageGuessRisk || 0}%`} />
              </ProgressBar>
            </div>
            
            <div className="mb-3">
              <p><strong>Total Moves:</strong> {stats.totalMoves}</p>
              <p><strong>Blind Guesses:</strong> {stats.blindGuesses} ({((stats.blindGuesses / stats.totalMoves) * 100).toFixed(1)}%)</p>
              <p><strong>Moves Near Numbers:</strong> {stats.adjacentToNumber} ({((stats.adjacentToNumber / stats.totalMoves) * 100).toFixed(1)}%)</p>
              <p><strong>Moves Near Empty:</strong> {stats.adjacentToEmpty} ({((stats.adjacentToEmpty / stats.totalMoves) * 100).toFixed(1)}%)</p>
              <p><strong>Safe Starts:</strong> {stats.safeStarts}</p>
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
