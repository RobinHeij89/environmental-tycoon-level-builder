import { availableTiles, TileEnum } from "../types";

export const tileEnumToClass = (tileType: TileEnum) => {
  const tiles = Object.keys(TileEnum).map(key => key.toLowerCase());
  return tiles[tileType];
}

export const getTileType = (tileType: TileEnum) => {
  const tile = availableTiles.find(tile => tile.type === tileType) ?? availableTiles[0];
  return tile;
}