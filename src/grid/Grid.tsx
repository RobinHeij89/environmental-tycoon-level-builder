import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import { Tile } from "../tiles/Tile";
import { AvailableTileType, Coord, LevelType, TileEnum, TileType } from "../types";
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
  const [showCoords, setShowCoords] = useState<boolean>(false);
  const [tileSize, setTileSize] = useState<number>(44);

  const resetGrid = () => {
    if (confirm('Are you sure you want to reset the grid?')) {
      const newTiles: TileType[] = [];
      Array.from({ length: tiles.gridSizeY }).map((_, y) => {
        Array.from({ length: tiles.gridSizeX }).map((_, x) => {
          newTiles.push({ x, y, type: TileEnum.Grass });
        })
      });
      setTiles({
        gridSizeX: 16,
        gridSizeY: 16,
        gridList: newTiles,
        roadTiles: [],
        previewTiles: []
      });
    }
  }

  const prefillGrid = () => {
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
  }

  useEffect(() => {
    prefillGrid();

  }, [tiles.gridSizeX, tiles.gridSizeY]);

  const downloadHandler = () => {
    const filename = 'level.json';
    const stipTiles = { ...tiles };
    delete stipTiles.previewTiles;
    const jsonStr = JSON.stringify(tiles);

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const inputFile = useRef(null);
  const onChangeFile = async (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.target) return;
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = e => {
        const target = e.target;
        const result = target?.result;
        result && setTiles(JSON.parse(result as string));
        if (inputFile.current) {
          (inputFile.current as HTMLInputElement).value = '';
        }
      };
    }
  };
  const incorrectDataLength = tiles.gridList.length > (tiles.gridSizeX * tiles.gridSizeY)

  const onMouseOutGrid = () => {
    setTiles(old => {
      return {
        ...old,
        previewTiles: []
      }
    })
  }
  return (
    <div className={style.wrapper}>
      <div className={clsx(style.bar, style.topbar)}>
        <div>
          <button onClick={resetGrid}>Reset and start over</button>
        </div>
        <div>
          <div>
            <b>Export</b><br />
            <button onClick={downloadHandler} disabled={incorrectDataLength}>Download JSON</button>
          </div>
          <div className={style.divider} />
          <div>
            <b>Import</b><br />
            <input
              type="file"
              onChange={onChangeFile}
              ref={inputFile}
            />
          </div>
        </div>
      </div>
      <div className={style.content}>
        <div
          className={clsx(style.grid, style.landscape)}
          style={{
            gridTemplateColumns: `repeat(${tiles.gridSizeX}, ${tileSize}px)`,
            gridTemplateRows: `repeat(${tiles.gridSizeY}, ${tileSize}px)`,
            gap: '1px'
          }}
          onMouseOut={onMouseOutGrid}
        >
          {
            Array.from({ length: tiles.gridSizeY }).map((_, y) => {
              const newY = tiles.gridSizeY - y - 1;
              return Array.from({ length: tiles.gridSizeX }).map((_, x) => {
                const mouseDownHandlerWithCoords = () => mouseDownHandler({ tileToSet, setStartPos, setIsDragging }, x, newY);
                const mouseUpHandlerWithCoords = () => mouseUpHandler({ tileToSet, tiles, setStartPos, setEndPos, setIsDragging, endPos, setTiles }, x, newY);
                const mouseEnterHandlerWithCoords = () => onMouseEnter({ tileToSet, isDragging, startPos, setEndPos, setTiles, tiles }, x, newY);
                return (
                  <Tile
                    showCoords={showCoords}
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
          gridTemplateColumns: `repeat(${tiles.gridSizeX}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${tiles.gridSizeY}, ${tileSize}px)`,
          gap: '1px'
        }}>
          {
            Array.from({ length: tiles.gridSizeY }).map((_, y) => {
              const newY = tiles.gridSizeY - y - 1;
              return Array.from({ length: tiles.gridSizeX }).map((_, x) => {
                return (
                  <Tile
                    showCoords={showCoords}
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
          gridTemplateColumns: `repeat(${tiles.gridSizeX}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${tiles.gridSizeY}, ${tileSize}px)`,
          gap: '1px'
        }}>
          {
            Array.from({ length: tiles.gridSizeY }).map((_, y) => {
              const newY = tiles.gridSizeY - y - 1;
              return Array.from({ length: tiles.gridSizeX }).map((_, x) => {
                return (
                  <Tile
                    showCoords={showCoords}
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
      <div className={clsx(style.bar, style.bottombar)}>
        <div>
          <label>
            <b>Show Coords</b><br />
            <input
              type="checkbox"
              checked={showCoords}
              onChange={() => setShowCoords(!showCoords)}
            />
          </label>
          <div className={style.divider} />
          <label>
            <b>Tile Size</b><br />
            <input
              type="number"
              value={tileSize}
              onChange={e => setTileSize(parseInt(e.target.value))}
              size={2}
            />
          </label>
        </div>
      </div>
    </div>

  )
}