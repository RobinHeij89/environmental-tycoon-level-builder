import clsx from "clsx";
import { Tile } from "../tiles/Tile";
import { AvailableTileType, Coord, LevelType, TileEnum } from "../types";
import style from './grid.module.css'
import { mouseDownHandler, mouseUpHandler, onMouseEnter } from "./mouse-events";

export interface GridProps {
  tiles: LevelType,
  setTiles: React.Dispatch<React.SetStateAction<LevelType>>,
  tileToSet: AvailableTileType | undefined,
  setTileToSet: React.Dispatch<React.SetStateAction<AvailableTileType | undefined>>,
  isDragging: boolean,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
  startPos: Coord | undefined,
  setStartPos: React.Dispatch<React.SetStateAction<Coord | undefined>>,
  endPos: Coord | undefined,
  setEndPos: React.Dispatch<React.SetStateAction<Coord | undefined>>,
}

export const Grid = ({
  tiles,
  setTiles,
  tileToSet,
  isDragging, setIsDragging,
  startPos, setStartPos,
  endPos, setEndPos,
}: GridProps) => {

  return (
    <div className={style.content}>
      <div className={clsx(style.grid, style.landscape)} style={{
        gridTemplateColumns: `repeat(${tiles.gridSizeX}, 44px)`,
        gridTemplateRows: `repeat(${tiles.gridSizeY}, 44px)`,
      }}>
        {
          Array.from({ length: tiles.gridSizeY }).map((_, y) => {
            const newY = tiles.gridSizeY - y - 1;
            return Array.from({ length: tiles.gridSizeX }).map((_, x) => {
              const mouseDownHandlerWithCoords = () => mouseDownHandler({ tileToSet, setStartPos, setIsDragging }, x, newY);
              const mouseUpHandlerWithCoords = () => mouseUpHandler({ tileToSet, tiles, setStartPos, setEndPos, setIsDragging, endPos, setTiles }, x, newY);
              const mouseEnterHandlerWithCoords = () => onMouseEnter({ tileToSet, isDragging, startPos, setEndPos, setTiles, tiles }, x, newY);
              return (
                <Tile
                  onMouseDown={mouseDownHandlerWithCoords}
                  onMouseUp={mouseUpHandlerWithCoords}
                  onMouseEnter={mouseEnterHandlerWithCoords}
                  key={`${x}${newY}_landscape`}
                  x={x}
                  y={newY}
                  tileType={
                    tiles.gridList.find(tile => tile.x === x && tile.y === newY)?.type ?? undefined
                  }
                />
              )
            })
          })
        }
      </div>

      <div className={clsx(style.grid, style.roads)} style={{
        gridTemplateColumns: `repeat(${tiles.gridSizeX}, 44px)`,
        gridTemplateRows: `repeat(${tiles.gridSizeY}, 44px)`,
      }}>
        {
          Array.from({ length: tiles.gridSizeY }).map((_, y) => {
            const newY = tiles.gridSizeY - y - 1;
            return Array.from({ length: tiles.gridSizeX }).map((_, x) => {
              return (
                <Tile
                  key={`${x}${newY}_roads`}
                  x={x}
                  y={newY}
                  tileType={
                    tiles.roadTiles.find(tile => tile.x === x && tile.y === newY) ? TileEnum.Road : undefined
                  } />
              )
            })
          })
        }
      </div>


      <div className={clsx(style.grid, style.preview)} style={{
        gridTemplateColumns: `repeat(${tiles.gridSizeX}, 44px)`,
        gridTemplateRows: `repeat(${tiles.gridSizeY}, 44px)`,
      }}>
        {
          Array.from({ length: tiles.gridSizeY }).map((_, y) => {
            const newY = tiles.gridSizeY - y - 1;
            return Array.from({ length: tiles.gridSizeX }).map((_, x) => {
              return (
                <Tile
                  key={`${x}${newY}_preview`}
                  x={x}
                  y={newY}
                  tileType={
                    tiles.previewTiles?.find(tile => tile.x === x && tile.y === newY)?.type
                  }
                  isValid={tiles.previewTiles?.find(tile => tile.x === x && tile.y === newY)?.isValid}
                />
              )
            })
          })
        }
      </div>
    </div>
  )
}