import { Button } from '@chakra-ui/react';
import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404 - Page Not Found</h1>
      <p style={styles.text}>Sorry, the page you are looking for does not exist.</p>
      <Button variant="primary" onClick={handleGoHome}>
        Go Home
      </Button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    padding: '20px',
  } as CSSProperties,
  header: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  text: {
    fontSize: '18px',
    marginBottom: '40px',
  },
};

export default NotFoundPage;
