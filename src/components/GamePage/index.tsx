import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '../../hook';
import { gamesData } from '../../store/selectors/gamesSelector';

import styles from './index.module.scss';

const GamePage: React.FC = () => {
  const { gameId } = useParams();
  const { games } = useAppSelector(gamesData);

  const decodedGameId = decodeURIComponent(gameId as string);

  const currentGame = useMemo(() => games.find((game) => game.id === decodedGameId), [decodedGameId, games]);

  if (!currentGame) {
    return <p>Game not found</p>;
  }

  return (
    <div className={styles.block}>
      <Link to="/">
        <button>На главную</button>
      </Link>
      <h1 className={styles.title}>{currentGame.title}</h1>
    </div>
  );
};

export default GamePage;
