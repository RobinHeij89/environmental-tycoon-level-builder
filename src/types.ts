export type Coord = {
  x: number
  y: number
}

export enum TileEnum {
  Water = '0',
  Grass = '1',
  Road = '2',
}

export type AvailableTileType = {
  type: TileEnum
  clashingTiles?: TileEnum[]
}

export type TileType = Coord & AvailableTileType;
export type TileTypePreview = Coord & AvailableTileType & { isValid: boolean };

export type LevelType = {
  gridSizeX: number
  gridSizeY: number
  gridList: TileType[]
  roadTiles: TileType[]
  previewTiles?: TileTypePreview[]
}

export const availableTiles: AvailableTileType[] = [
  { type: TileEnum.Water, clashingTiles: [TileEnum.Road] },
  { type: TileEnum.Grass },
  { type: TileEnum.Road, clashingTiles: [TileEnum.Water] },
]