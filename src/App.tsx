import clsx from 'clsx';
import { SetStateAction, useEffect, useState } from 'react'
import useLocalStorage from 'use-local-storage';

import style from './app.module.css'
import { Grid, GridProps } from './grid/Grid';
import { LocalStorageList } from './localstorage/LocalStorageList';
import { Sidebar, SidebarProps } from './sidebar/Sidebar';
import { AvailableTileType, Coord, type LevelTypeLS } from './types';

function App() {
  const [tileToSet, setTileToSet] = useState<AvailableTileType>();
  const [levelsLS, setLevelsLS] = useLocalStorage<LevelTypeLS[]>("levels", []);
  const [tiles, setTiles] = useState<LevelTypeLS | null>(levelsLS[0]);

  useEffect(() => {
    setLevelsLS(levelsLS.map(level => {
      if (tiles && level.uuid === tiles.uuid) {
        return tiles;
      }
      return level;
    }));
  }, [tiles]);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<Coord>();
  const [endPos, setEndPos] = useState<Coord>();
  const [expandedSidebar, setExpandedSidebar] = useState<boolean>(false);

  const throughProps = {
    tiles,
    setTiles,
    tileToSet,
    setTileToSet,
    isDragging,
    setIsDragging,
    startPos,
    setStartPos,
    endPos,
    setEndPos,
    expandedSidebar,
    setExpandedSidebar,
  }

  return (
    <div className={style.wrapper}>
      <div className={clsx(style.sidebar, (expandedSidebar || !tiles) ? style.expanded : '')}>
        <div className={style.content}>
          <LocalStorageList
            levelsLS={levelsLS}
            setLevelsLS={setLevelsLS as React.Dispatch<SetStateAction<LevelTypeLS[]>>}
            tiles={tiles}
            setTiles={setTiles}
          />
        </div>
      </div>
      <div className={style.content}>
        {tiles ? (
          <>
            <Grid
              {...throughProps as GridProps}
              seed={tiles.treeSeed}
            />
            <Sidebar
              {...throughProps as SidebarProps}
            />
          </>
        ) : <p>Click on a level to start editing</p>
        }
      </div>
    </div>
  )
}

export default App
