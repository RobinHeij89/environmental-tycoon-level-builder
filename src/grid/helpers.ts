import { LevelTypeLS, TileEnum, TileType } from "../types"
import { GridProps } from "./Grid"

export const removeOutOfBounds = (setTiles: React.Dispatch<React.SetStateAction<LevelTypeLS>>) => {
  setTiles(old => {
    const size = old.chunkAmount * old.chunkSize;
    console.log(size);
    console.log(old);
    return {
      ...old,
      gridTiles: old.gridTiles.filter(tile => tile.x < size && tile.y < size),
      roadTiles: old.roadTiles.filter(tile => tile.x < size && tile.y < size)
    }
  })
}

export const checkValidTile = ({ tileToSet, tiles }: Partial<GridProps>, x: number, y: number) => {
  if (!tileToSet) return false;

  const gridTile = tiles!.gridTiles.find(tile => tile.x === x && tile.y === y);
  const roadTile = tiles!.roadTiles.find(tile => tile.x === x && tile.y === y);
  if (!gridTile && !roadTile) return false;

  const gridTileToCheck = gridTile ? gridTile.type : undefined;
  const roadTileToCheck = roadTile ? roadTile.type : undefined;
  const gridTileClashFound = gridTileToCheck ? tileToSet!.clashingTiles?.includes(gridTileToCheck) : false;
  const roadTileClashFound = roadTileToCheck ? tileToSet!.clashingTiles?.includes(roadTileToCheck) : false;
  return !gridTileClashFound && !roadTileClashFound;
}

export const updateGridTiles = (gridTiles: TileType[], previewTiles: TileType[], remove?: boolean) => {
  const newGridList = gridTiles.filter(tile => !previewTiles.find(previewTile => previewTile.x === tile.x && previewTile.y === tile.y));
  if (remove) {
    return newGridList;
  }

  return [
    ...newGridList,
    ...previewTiles
  ]
}

export const updateElevation = (gridTiles: TileType[], previewTiles: TileType[], action: 'up' | 'down') => {

  return gridTiles.map(tile => {
    const previewTile = previewTiles.find(previewTile => previewTile.x === tile.x && previewTile.y === tile.y);
    if (!previewTile) {
      return tile;
    }

    if (action === 'up') {
      return {
        ...tile,
        elevation: (tile.type === TileEnum.Grass || tile.type === TileEnum.Water) ? tile.elevation + 1 : 0
      }
    }

    return {
      ...tile,
      elevation: (tile.type === TileEnum.Grass || tile.type === TileEnum.Water) ? tile.elevation - 1 : 0
    }
  })
}