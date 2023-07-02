import { CircularProgress, Container } from '@mui/material';
import { GamePage, GamesList } from './components';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useGetGamesListQuery } from './services/gamesList';

function App() {
  const { isFetching } = useGetGamesListQuery('');

  return (
    <Container maxWidth="lg">
      {isFetching ? (
        <div className="block">
          <CircularProgress />
        </div>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<GamesList />} />
            <Route path="/games/:gameId" element={<GamePage />} />
          </Routes>
        </Router>
      )}
    </Container>
  );
}

export default App;
