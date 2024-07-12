import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import { Tile } from "../tiles/Tile";
import { AvailableTileType, Coord, LevelTypeLS, TileEnum, TileType } from "../types";
import style from './grid.module.css'
import { mouseDownHandler, mouseUpHandler, onMouseEnter } from "./mouse-events";

export interface GridProps {
  tiles: LevelTypeLS,
  setTiles: React.Dispatch<React.SetStateAction<LevelTypeLS>>,
  tileToSet: AvailableTileType | undefined,
  setTileToSet: React.Dispatch<React.SetStateAction<AvailableTileType | undefined>>,
  isDragging: boolean,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
  startPos: Coord | undefined,
  setStartPos: React.Dispatch<React.SetStateAction<Coord | undefined>>,
  endPos: Coord | undefined,
  setEndPos: React.Dispatch<React.SetStateAction<Coord | undefined>>,
  expandedSidebar: boolean,
  setExpandedSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

export const Grid = ({
  tiles,
  setTiles,
  tileToSet,
  isDragging, setIsDragging,
  startPos, setStartPos,
  endPos, setEndPos,
  expandedSidebar, setExpandedSidebar
}: GridProps) => {
  const [showCoords, setShowCoords] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [tileSize, setTileSize] = useState<number>(44);


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
        if (confirm(`Are you sure you want to import this file? It will overwrite the current level. (${tiles.displayName})`)) {
          result && setTiles({
            ...JSON.parse(result as string),
            displayName: tiles.displayName,
            uuid: tiles.uuid
          });
        }
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
          <button onClick={() => setExpandedSidebar(!expandedSidebar)}>
            {
              expandedSidebar ? 'Hide Sidebar' : 'Show Sidebar'
            }
          </button>
          <input type="text" value={tiles.displayName} onChange={e => setTiles({ ...tiles, displayName: e.target.value })} />
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
            gap: showGrid ? 1 : 0
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
                    showGrid={showGrid}
                    onMouseDown={mouseDownHandlerWithCoords}
                    onMouseUp={mouseUpHandlerWithCoords}
                    onMouseEnter={mouseEnterHandlerWithCoords}
                    key={`${x}${newY}_landscape`}
                    x={x}
                    y={newY}
                    tileType={
                      tiles.gridList.find(tile => tile.x === x && tile.y === newY)?.type ?? undefined
                    }
                    neighbours={
                      {
                        top: tiles.gridList.find(tile => tile.x === x && tile.y === newY + 1)?.type,
                        right: tiles.gridList.find(tile => tile.x === x + 1 && tile.y === newY)?.type,
                        bottom: tiles.gridList.find(tile => tile.x === x && tile.y === newY - 1)?.type,
                        left: tiles.gridList.find(tile => tile.x === x - 1 && tile.y === newY)?.type,
                      }
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
          gap: showGrid ? 1 : 0
        }}>
          {
            Array.from({ length: tiles.gridSizeY }).map((_, y) => {
              const newY = tiles.gridSizeY - y - 1;
              return Array.from({ length: tiles.gridSizeX }).map((_, x) => {
                return (
                  <Tile
                    showCoords={showCoords}
                    showGrid={showGrid}
                    key={`${x}${newY}_roads`}
                    x={x}
                    y={newY}
                    tileType={
                      tiles.roadTiles.find(tile => tile.x === x && tile.y === newY) ? TileEnum.Road : undefined
                    }

                    neighbours={
                      {
                        top: tiles.roadTiles.find(tile => tile.x === x && tile.y === newY + 1)?.type,
                        right: tiles.roadTiles.find(tile => tile.x === x + 1 && tile.y === newY)?.type,
                        bottom: tiles.roadTiles.find(tile => tile.x === x && tile.y === newY - 1)?.type,
                        left: tiles.roadTiles.find(tile => tile.x === x - 1 && tile.y === newY)?.type,
                      }
                    }
                  />
                )
              })
            })
          }
        </div>


        <div className={clsx(style.grid, style.preview)} style={{
          gridTemplateColumns: `repeat(${tiles.gridSizeX}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${tiles.gridSizeY}, ${tileSize}px)`,
          gap: showGrid ? 1 : 0
        }}>
          {
            Array.from({ length: tiles.gridSizeY }).map((_, y) => {
              const newY = tiles.gridSizeY - y - 1;
              return Array.from({ length: tiles.gridSizeX }).map((_, x) => {
                return (
                  <Tile
                    isPreview={tiles.previewTiles?.findIndex(tile => tile.x === x && tile.y === newY) !== -1}
                    showCoords={showCoords}
                    showGrid={showGrid}
                    key={`${x}${newY}_preview`}
                    x={x}
                    y={newY}
                    tileType={
                      tiles.previewTiles?.find(tile => tile.x === x && tile.y === newY)?.type
                    }
                    isValid={tiles.previewTiles?.find(tile => tile.x === x && tile.y === newY)?.isValid}
                    neighbours={
                      {
                        top: undefined,
                        right: undefined,
                        bottom: undefined,
                        left: undefined,
                      }
                    }
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
            <b>Show Grid</b><br />
            <input
              type="checkbox"
              checked={showGrid}
              onChange={() => setShowGrid(!showGrid)}
            />
          </label>
          <div className={style.divider} />
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