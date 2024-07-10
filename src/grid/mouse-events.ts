import { TileEnum } from "../types";
import { calculateLine, calculateArea } from "./calculations";
import { GridProps } from "./Grid";
import { checkValidTile, updateGridTiles } from "./helpers";

export const mouseDownHandler = ({ tileToSet, setStartPos, setIsDragging }: Partial<GridProps>, x: number, y: number) => {
  if (!tileToSet) {
    return;
  }
  setStartPos!({ x, y });
  setIsDragging!(true);
}

export const mouseUpHandler = ({ tileToSet, tiles, setStartPos, setEndPos, setIsDragging, endPos, setTiles }: Partial<GridProps>, x: number, y: number) => {
  if (!tileToSet) {
    return;
  }
  setStartPos!(undefined);
  setEndPos!(undefined);
  setIsDragging!(false);
  if (!endPos) {
    const isValid = checkValidTile({ tileToSet, tiles }, x, y);
    if (isValid) {
      if (tileToSet.type === TileEnum.Road) {
        setTiles!(old => {
          return {
            ...old,
            roadTiles: updateGridTiles(old.roadTiles, [{ x, y, type: tileToSet.type }]),
            previewTiles: []
          }
        })
      } else {
        setTiles!(old => {
          return {
            ...old,
            gridList: updateGridTiles(old.gridList, [{ x, y, type: tileToSet.type }]),
            previewTiles: []
          }
        })
      }

      setTiles!(old => {
        return {
          ...old,
          gridTiles: [
            ...old.gridList.filter(tile => tile.x !== x && tile.y !== y),
            {
              x,
              y,
              type: tileToSet!.type,
              isValid
            }
          ],
          previewTiles: []
        }
      })
    }
  } else {
    if (tiles!.previewTiles?.findIndex(tile => !tile.isValid) === -1) {
      if (tiles!.previewTiles[0].type === TileEnum.Road) {
        setTiles!(old => {
          return {
            ...old,
            roadTiles: updateGridTiles(old.roadTiles, old.previewTiles!),
            previewTiles: []
          }
        })
      } else {
        setTiles!(old => {
          return {
            ...old,
            gridList: updateGridTiles(old.gridList, old.previewTiles!),
            previewTiles: []
          }
        })
      }
    } else {
      setTiles!(old => {
        return {
          ...old,
          previewTiles: []
        }
      })
    }
  }
}


export const onMouseEnter = ({ tileToSet, isDragging, startPos, setEndPos, setTiles, tiles }: Partial<GridProps>, x: number, y: number) => {
  if (isDragging) {
    setEndPos!({ x, y });
    if (tileToSet?.type === TileEnum.Road) {
      calculateLine({ setTiles, tileToSet, tiles }, startPos!, { x, y });
    } else {
      calculateArea({ setTiles, tileToSet, tiles }, startPos!, { x, y });
    }
  } else {
    if (tileToSet) {
      setTiles!(old => {
        return {
          ...old,
          previewTiles: [
            { x, y, type: tileToSet?.type ?? TileEnum.Grass, isValid: checkValidTile({ tileToSet, tiles }, x, y) }
          ]
        }
      }
      )
    }
  }
}
