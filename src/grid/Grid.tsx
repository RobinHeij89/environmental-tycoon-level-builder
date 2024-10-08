import clsx from "clsx";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";

import { Tile } from "../tiles/Tile";
import { AvailableTileType, Coord, LevelTypeLS, TileEnum, TileType } from "../types";
import style from './grid.module.css'
import { mouseDownHandler, mouseUpHandler, onMouseEnter } from "./mouse-events";

import Perlin from '../perlin';
import { DualGridTile } from "../tiles/DualGridTile";

// type ChunkExportType = {
//   terrainTiles: TileType[]
//   x: number
//   y: number
// }
// export const chunkify = (gridTiles: TileType[], chunkAmount: number, chunkSize: number) => {
//   const chunks: ChunkExportType[] = [];
//   Array.from({ length: chunkAmount }).map((_, y) => {
//     Array.from({ length: chunkAmount }).map((_, x) => {
//       const chunk: ChunkExportType = { terrainTiles: [], x, y };
//       Array.from({ length: chunkSize }).map((_, y2) => {
//         Array.from({ length: chunkSize }).map((_, x2) => {
//           const tile = gridTiles.find(tile => tile.x === x * chunkSize + x2 && tile.y === y * chunkSize + y2);
//           if (tile) {
//             chunk.terrainTiles.push(tile);
//           }
//         })
//       });
//       chunk.terrainTiles.sort((a, b) => {
//         if (a.y === b.y) {
//           return a.x - b.x;
//         }
//         return a.y - b.y;
//       });

//       chunks.push(chunk);
//     })
//   });
//   chunks.sort((a, b) => {
//     if (a.y === b.y) {
//       return a.x - b.x;
//     }
//     return a.y - b.y;
//   });
//   return chunks
// }
export interface GridProps {
  seed: number,
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
  expandedSidebar, setExpandedSidebar,
  seed
}: GridProps) => {
  const [showDualGrid, setShowDualGrid] = useState<boolean>(false);
  const [showCoords, setShowCoords] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showTreeHM, setShowTreeHM] = useState<boolean>(true);
  const [tileSize, setTileSize] = useState<number>(44);
  const [noise, setNoise] = useState<any>(new Perlin(seed));

  useEffect(() => {
    setNoise(new Perlin(seed));
  }, [seed]);

  const multiplier = 5;

  const prefillGrid = () => {
    const newTiles: TileType[] = [];
    Array.from({ length: gridRowSize }).map((_, y) => {
      Array.from({ length: gridRowSize }).map((_, x) => {
        const hasTile = tiles.gridTiles.find(tile => tile.x === x && tile.y === y);
        const treeHM = Math.floor(noise.perlin2(x / 50, y / 50) * multiplier + multiplier);

        if (!hasTile) {
          newTiles.push({ x, y, type: TileEnum.Grass, elevation: 1, treeHM: treeHM });
        } else {
          newTiles.push(hasTile);
        }
      })
    });
    setTiles(old => {
      return {
        ...old,
        gridTiles: newTiles

      }
    })
  }

  useEffect(() => {
    prefillGrid();
  }, [tiles.chunkAmount, tiles.chunkSize]);

  const sortByCoord = (a: TileType, b: TileType) => {
    if (a.y === b.y) {
      return a.x - b.x;
    }
    return a.y - b.y;
  }

  const downloadHandler = () => {
    const filename = 'level.json';
    const jsonStr = JSON.stringify({
      chunkAmount: tiles.chunkAmount,
      chunkSize: tiles.chunkSize,
      uuid: tiles.uuid,
      displayName: tiles.displayName,
      terrainTiles: tiles.gridTiles.sort(sortByCoord),
      roadTiles: tiles.roadTiles.sort(sortByCoord)
    });

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
  const neededArraySize = (Math.pow(tiles.chunkAmount, 2) * Math.pow(tiles.chunkSize, 2) + (tiles.chunkAmount * tiles.chunkSize * 2) + 1);
  const incorrectDataLength = tiles.gridTiles.length > neededArraySize
  console.log(tiles.gridTiles.length, neededArraySize)

  const onMouseOutGrid = () => {
    setTiles(old => {
      return {
        ...old,
        previewTiles: []
      }
    })
  }

  const changeSeedHandler = () => {
    setTiles(old => {
      return {
        ...old,
        treeSeed: Math.floor(Math.random() * 65535) + 1,
        gridTiles: old.gridTiles.map(tile => {
          const treeHM = Math.floor(noise.perlin2(tile.x / 50, tile.y / 50) * multiplier + multiplier);
          return {
            ...tile,
            treeHM: treeHM
          }
        })
      }
    })
  }

  const gridRowSize = tiles.chunkAmount * tiles.chunkSize + 1
  const dualGridRowSize = tiles.chunkAmount * tiles.chunkSize

  return (
    <div className={style.wrapper}>
      <div className={clsx(style.bar, style.topbar)}>
        <div>
          <Button onClick={() => setExpandedSidebar(!expandedSidebar)}>
            {
              expandedSidebar ? 'Hide Sidebar' : 'Show Sidebar'
            }
          </Button>
          <InputText type="text" value={tiles.displayName} onChange={e => setTiles({ ...tiles, displayName: e.target.value })} />
          <div className={style.divider} />
          <div>
            <b>Change tree seed</b><br />
            <Button onClick={changeSeedHandler}>Change Seed ({seed})</Button>
          </div>
        </div>
        <div>
          <div>
            <b>Export</b><br />
            <Button onClick={downloadHandler} disabled={incorrectDataLength}>Download JSON</Button>
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

        {showDualGrid && (
          <div
            className={clsx(style.grid, style.dualgrid, style.landscape)}
            style={{
              gridTemplateColumns: `repeat(${dualGridRowSize}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${dualGridRowSize}, ${tileSize}px)`,
              gap: showGrid ? 1 : 0
            }}
          >
            {
              Array.from({ length: dualGridRowSize }).map((_, y) => {
                const newY = (gridRowSize) - y - 1;
                return Array.from({ length: dualGridRowSize }).map((_, x) => {

                  const coords = {
                    topRight: { x: x + 1, y: newY },
                    bottomRight: { x: x + 1, y: newY - 1 },
                    bottomLeft: { x: x, y: newY - 1 },
                    topLeft: { x: x, y: newY },
                  }

                  return (
                    <DualGridTile
                      tiles={
                        {
                          topRight: tiles.gridTiles.find(tile => tile.x === coords.topRight.x && tile.y === coords.topRight.y)?.type,
                          bottomRight: tiles.gridTiles.find(tile => tile.x === coords.bottomRight.x && tile.y === coords.bottomRight.y)?.type,
                          bottomLeft: tiles.gridTiles.find(tile => tile.x === coords.bottomLeft.x && tile.y === coords.bottomLeft.y)?.type,
                          topLeft: tiles.gridTiles.find(tile => tile.x === coords.topLeft.x && tile.y === coords.topLeft.y)?.type,
                        }
                      }
                    />
                  )
                })
              })
            }
          </div>
        )}

        <div
          className={clsx(style.grid, style.landscape)}
          style={{
            gridTemplateColumns: `repeat(${gridRowSize}, ${tileSize}px)`,
            gridTemplateRows: `repeat(${gridRowSize}, ${tileSize}px)`,
            gap: showGrid ? 1 : 0
          }}
          onMouseOut={onMouseOutGrid}
        >
          {
            Array.from({ length: gridRowSize }).map((_, y) => {
              const newY = (gridRowSize) - y - 1;
              return Array.from({ length: gridRowSize }).map((_, x) => {
                const mouseDownHandlerWithCoords = () => mouseDownHandler({ tileToSet, setStartPos, setIsDragging }, x, newY);
                const mouseUpHandlerWithCoords = () => mouseUpHandler({ tileToSet, tiles, setStartPos, setEndPos, setIsDragging, endPos, setTiles }, x, newY);
                const mouseEnterHandlerWithCoords = () => onMouseEnter({ tileToSet, isDragging, startPos, setEndPos, setTiles, tiles }, x, newY);

                const thisTile = tiles.gridTiles.find(tile => tile.x === x && tile.y === newY);

                return (
                  <Tile
                    showCoords={showCoords}
                    showGrid={showGrid}
                    showTreeHM={showTreeHM}
                    showElevation={tileToSet?.type === TileEnum.ElevationUp || tileToSet?.type === TileEnum.ElevationDown}
                    elevation={thisTile?.type === TileEnum.Grass ? thisTile?.elevation : 0}
                    treeHM={thisTile?.type === TileEnum.Grass ? thisTile?.treeHM : 0}
                    onMouseDown={mouseDownHandlerWithCoords}
                    onMouseUp={mouseUpHandlerWithCoords}
                    onMouseEnter={mouseEnterHandlerWithCoords}
                    key={`${x}${newY}_landscape`}
                    x={x}
                    y={newY}
                    tileType={
                      thisTile?.type ?? undefined
                    }
                    neighbours={
                      {
                        top: tiles.gridTiles.find(tile => tile.x === x && tile.y === newY + 1)?.type,
                        topRight: tiles.gridTiles.find(tile => tile.x === x + 1 && tile.y === newY + 1)?.type,
                        right: tiles.gridTiles.find(tile => tile.x === x + 1 && tile.y === newY)?.type,
                        bottomRight: tiles.gridTiles.find(tile => tile.x === x + 1 && tile.y === newY - 1)?.type,
                        bottom: tiles.gridTiles.find(tile => tile.x === x && tile.y === newY - 1)?.type,
                        bottomLeft: tiles.gridTiles.find(tile => tile.x === x - 1 && tile.y === newY - 1)?.type,
                        left: tiles.gridTiles.find(tile => tile.x === x - 1 && tile.y === newY)?.type,
                        topLeft: tiles.gridTiles.find(tile => tile.x === x - 1 && tile.y === newY + 1)?.type,
                      }
                    }
                  />
                )
              })
            })
          }
        </div>

        <div className={clsx(style.grid, style.roads)} style={{
          gridTemplateColumns: `repeat(${gridRowSize}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${gridRowSize}, ${tileSize}px)`,
          gap: showGrid ? 1 : 0
        }}>
          {
            Array.from({ length: gridRowSize }).map((_, y) => {
              const newY = (gridRowSize) - y - 1;
              return Array.from({ length: gridRowSize }).map((_, x) => {
                return (
                  <Tile
                    showCoords={false}
                    showGrid={false}
                    showTreeHM={false}
                    showElevation={false}
                    elevation={0}
                    treeHM={0}
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
          gridTemplateColumns: `repeat(${gridRowSize}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${gridRowSize}, ${tileSize}px)`,
          gap: showGrid ? 1 : 0
        }}>
          {
            Array.from({ length: gridRowSize }).map((_, y) => {
              const newY = (gridRowSize) - y - 1;
              return Array.from({ length: gridRowSize }).map((_, x) => {
                return (
                  <Tile
                    isPreview={tiles.previewTiles?.findIndex(tile => tile.x === x && tile.y === newY) !== -1}
                    showCoords={false}
                    showTreeHM={false}
                    showGrid={false}
                    showElevation={false}
                    elevation={0}
                    treeHM={0}
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

            <Checkbox
              checked={showGrid}
              onChange={() => setShowGrid(!showGrid)}
            ></Checkbox>

          </label>
          <div className={style.divider} />
          <label>
            <b>Show Coords</b><br />
            <Checkbox
              checked={showCoords}
              onChange={() => setShowCoords(!showCoords)}
            ></Checkbox>
          </label>
          <div className={style.divider} />
          <label>
            <b>Show Dual Grid</b><br />
            <Checkbox
              checked={showDualGrid}
              onChange={() => setShowDualGrid(!showDualGrid)}
            ></Checkbox>
          </label>
          <div className={style.divider} />

          <label>
            <b>Show tree heightmap</b><br />

            <Checkbox
              checked={showTreeHM}
              onChange={() => setShowTreeHM(!showTreeHM)}
            ></Checkbox>

          </label>
          <div className={style.divider} />
          <label>
            <b>Tile Size</b><br />
            <InputNumber
              value={tileSize}
              onChange={e => setTileSize(e.value ?? -1)}
              size={5}
              suffix=" px"
            />
          </label>
        </div>
      </div>
    </div>

  )
}