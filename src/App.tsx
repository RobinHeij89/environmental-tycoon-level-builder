import { useState } from 'react'

import style from './app.module.css'
import { Grid } from './grid/Grid';
import { Sidebar } from './sidebar/Sidebar';
import { AvailableTileType, Coord, type LevelType } from './types';

function App() {
  const [tileToSet, setTileToSet] = useState<AvailableTileType>();
  const [tiles, setTiles] = useState<LevelType>({
    gridSizeX: 16,
    gridSizeY: 16,
    gridList: [],
    roadTiles: [],
    previewTiles: []
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<Coord>();
  const [endPos, setEndPos] = useState<Coord>();


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
    setEndPos
  }
  return (
    <div className={style.wrapper}>
      <Grid
        {...throughProps}
      />
      <Sidebar
        {...throughProps}
      />
    </div>
  )
}

export default App
