import React, { useEffect, useMemo } from 'react';
import { Card, CardMedia, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hook';
import { useGetGamesListQuery } from '../../services/gamesList';
import { addMoreGames, collectProviders, selectProvider, selectRealKey, updateRealKeys } from '../../store/slices/gamesSlice';
import { gamesData } from '../../store/selectors/gamesSelector';

import styles from './index.module.scss';

const GamesList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { displayedGames, providers, realKeys, selectedProvider, selectedReal } = useAppSelector(gamesData);

  const { data, isFetching } = useGetGamesListQuery('');

  useEffect(() => {
    if (data) {
      dispatch(collectProviders());
      dispatch(updateRealKeys());
    }
  }, [data, dispatch]);

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
      data?.filter((game) => {
        if (selectedProvider && game.provider !== selectedProvider) {
          return false;
        }
        if (selectedReal && !game.real[selectedReal as keyof typeof game.real]) {
          return false;
        }
        return true;
      }),
    [data, selectedProvider, selectedReal]
  );

  const renderGames = () => {
    if (isFetching) {
      return <p>Loading...</p>;
    }

    const displayed = filteredGames?.slice(0, displayedGames);

    const notAllGames = filteredGames && displayedGames < filteredGames?.length;

    return (
      <div>
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
        <div className={styles.wrapper}>
          {displayed?.map((game) => (
            <Stack key={game.id}>
              <Card>
                <CardMedia component="img" image={`https://cdn2.softswiss.net/i/s2/${game.id}.png`} alt="Paella dish" />
              </Card>
              <h3>{game.title}</h3>
            </Stack>
          ))}
        </div>
        {notAllGames && <button onClick={handleMoreGames}>Показать еще</button>}
      </div>
    );
  };

  return <>{renderGames()}</>;
};

export default GamesList;
