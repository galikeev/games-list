import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hook';
import { addMoreGames, collectProviders, selectProvider, selectRealKey, updateRealKeys } from '../../store/slices/gamesSlice';
import { gamesData } from '../../store/selectors/gamesSelector';

import styles from './index.module.scss';

const GamesList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { displayedGames, providers, realKeys, selectedProvider, selectedReal, games } = useAppSelector(gamesData);

  useEffect(() => {
    if (games) {
      dispatch(collectProviders());
      dispatch(updateRealKeys());
    }
  }, [games, dispatch]);

  const handleChangeProvider = (event: SelectChangeEvent) => {
    dispatch(selectProvider(event.target.value as string));
  };

  const handleChangeReal = (event: SelectChangeEvent) => {
    dispatch(selectRealKey(event.target.value as string));
  };

  const handleMoreGames = () => {
    dispatch(addMoreGames());
  };

  const filteredGames = useMemo(
    () =>
      games?.filter((game) => {
        if (selectedProvider && game.provider !== selectedProvider) {
          return false;
        }
        if (selectedReal && !game.real[selectedReal as keyof typeof game.real]) {
          return false;
        }
        return true;
      }),
    [games, selectedProvider, selectedReal]
  );

  const renderGames = useMemo(() => filteredGames?.slice(0, displayedGames), [displayedGames, filteredGames]);

  const notAllGames = useMemo(() => filteredGames && displayedGames < filteredGames?.length, [displayedGames, filteredGames]);

  return (
    <div className={styles.block}>
      <Stack spacing={2} direction="row">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Провайдер</InputLabel>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedProvider} label="Провайдер" onChange={handleChangeProvider}>
            {providers?.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Валюта</InputLabel>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedReal} label="Валюта" onChange={handleChangeReal}>
            {realKeys?.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {renderGames?.length ? (
        <div className={styles.wrapper}>
          {renderGames?.map((game) => (
            <Stack key={game.id}>
              <Card>
                <Link to={`/games/${encodeURIComponent(game.id)}`}>
                  <CardMedia component="img" image={`https://cdn2.softswiss.net/i/s2/${game.id}.png`} alt="Paella dish" />
                </Link>
              </Card>
              <h4>{game.title}</h4>
            </Stack>
          ))}
        </div>
      ) : (
        <div>
          <span className={styles.emptyText}>Данных нет</span>
        </div>
      )}
      {notAllGames && (
        <div>
          <button onClick={handleMoreGames} className={styles.buttonMore}>
            Показать еще
          </button>
        </div>
      )}
    </div>
  );
};

export default GamesList;
