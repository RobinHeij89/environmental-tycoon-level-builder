import { LevelType, TileType } from "../types"
import { GridProps } from "./Grid"

export const removeOutOfBounds = (setTiles: React.Dispatch<React.SetStateAction<LevelType>>) => {
  setTiles(old => {
    return {
      ...old,
      gridList: old.gridList.filter(tile => tile.x < old.gridSizeX && tile.y < old.gridSizeY),
      roadTiles: old.roadTiles.filter(tile => tile.x < old.gridSizeX && tile.y < old.gridSizeY)
    }
  })
}

export const checkValidTile = ({ tileToSet, tiles }: Partial<GridProps>, x: number, y: number) => {
  const gridTileToCheck = tiles!.gridList.find(tile => tile.x === x && tile.y === y)?.type!;
  const roadTileToCheck = tiles!.roadTiles.find(tile => tile.x === x && tile.y === y)?.type!;
  const gridTileClashFound = tileToSet!.clashingTiles?.includes(gridTileToCheck);
  const roadTileClashFound = tileToSet!.clashingTiles?.includes(roadTileToCheck);
  return !gridTileClashFound && !roadTileClashFound;
}

export const updateGridTiles = (gridList: TileType[], previewTiles: TileType[]) => {
  const newGridList = gridList.filter(tile => !previewTiles.find(previewTile => previewTile.x === tile.x && previewTile.y === tile.y));
  return [
    ...newGridList,
    ...previewTiles
  ]
}