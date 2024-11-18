import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaTrophy } from 'react-icons/fa';
import StatisticsApi from '../../components/apis/StatisticsApi';
import { useCookies } from 'react-cookie';

const StatisticsPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSolves, setTotalSolves] = useState(0);
  const [cookies] = useCookies(['username','jwt']);
  const statisticsApi = new StatisticsApi();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [users, solves] = await Promise.all([
          statisticsApi.getTotalUsers(cookies.jwt),
          statisticsApi.getTotalSolves(cookies.jwt)
        ]);
        
        setTotalUsers(users);
        setTotalSolves(solves);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const StatCard = ({ icon: Icon, title, value }) => (
    <Card className="h-100 text-center p-4 stat-card">
      <Card.Body>
        <Icon size={48} className="mb-3 text-primary" />
        <Card.Title>{title}</Card.Title>
        <Card.Text className="h2 text-primary">
          {value.toLocaleString()}
        </Card.Text>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Minesweeper Statistics</h1>
      
      <Row className="g-4">
        <Col xs={12} md={6}>
          <StatCard
            icon={FaUsers}
            title="Total Users"
            value={totalUsers}
          />
        </Col>
        <Col xs={12} md={6}>
          <StatCard
            icon={FaTrophy}
            title="Total Games Solved"
            value={totalSolves}
          />
        </Col>
      </Row>

      <style>
        {`
          .stat-card {
            transition: transform 0.2s;
          }
          .stat-card:hover {
            transform: scale(1.02);
          }
        `}
      </style>
    </Container>
  );
};

export default StatisticsPage;
