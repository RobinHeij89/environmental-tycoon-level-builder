import { useEffect, useState } from 'react'
import style from './app.module.css'
import { AvailableTileType, Coord, TileEnum, TileType, type LevelType } from './types';
import { Sidebar } from './sidebar/Sidebar';
import { Grid } from './grid/Grid';

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

  useEffect(() => {
    const newTiles: TileType[] = [];
    Array.from({ length: tiles.gridSizeY }).map((_, y) => {
      Array.from({ length: tiles.gridSizeX }).map((_, x) => {
        const hasTile = tiles.gridList.find(tile => tile.x === x && tile.y === y);
        !hasTile && newTiles.push({ x, y, type: TileEnum.Grass });
      })
    });
    setTiles(old => {
      return {
        ...old,
        gridList: [
          ...old.gridList,
          ...newTiles
        ]
      }
    })
  }, [tiles.gridSizeX, tiles.gridSizeY]);

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
