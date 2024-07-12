export type Coord = {
  x: number
  y: number
}

export enum TileEnum {
  Water = '0',
  Grass = '1',
  Road = '2',
  Destroy = '3',
}

export enum CategoryEnum {
  Terrain = 'Terrain',
  Road = 'Road',
  Building = 'Building',
  Tool = 'Tool',
}

export type AvailableTileType = {
  type: TileEnum
  category: CategoryEnum
  clashingTiles?: TileEnum[]
}


export type TileTypeEditor = Coord & AvailableTileType;
export type TileType = Omit<TileTypeEditor, 'category'>
export type TileTypePreviewEditor = Coord & AvailableTileType & { isValid: boolean };
export type TileTypePreview = Omit<TileTypePreviewEditor, 'category'>

export type LevelType = {
  gridSizeX: number
  gridSizeY: number
  gridList: TileType[]
  roadTiles: TileType[]
  previewTiles?: TileTypePreview[]
}

export type LevelTypeLS = LevelType & {
  uuid: string
  displayName: string
}

export const availableTiles: AvailableTileType[] = [
  { type: TileEnum.Water, clashingTiles: [TileEnum.Road], category: CategoryEnum.Terrain },
  { type: TileEnum.Grass, category: CategoryEnum.Terrain },
  { type: TileEnum.Road, clashingTiles: [TileEnum.Water], category: CategoryEnum.Road },
  { type: TileEnum.Destroy, category: CategoryEnum.Tool },
]