export type Coord = {
  x: number
  y: number
}

export enum TileEnum {
  Water = '0',
  Grass = '1',
  Road = '2',
  ElevationUp = '3',
  ElevationDown = '4',
  Destroy = '5',
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


export type TerrainTileConfig = {
  type: TileEnum.Water | TileEnum.Grass
  elevation: number
}

export type RoadTileConfig = {
  type: TileEnum.Road
}

export type ToolTileConfig = {
  type: TileEnum.Destroy | TileEnum.ElevationUp | TileEnum.ElevationDown
}

export type TileConfig = TerrainTileConfig | RoadTileConfig | ToolTileConfig


export type TileTypeEditor = Coord & AvailableTileType;
export type TileType = Omit<TileTypeEditor, 'category' | 'clashingTiles'> & TileConfig
export type TileTypePreviewEditor = Coord & AvailableTileType & { isValid: boolean };
export type TileTypePreview = Omit<TileTypePreviewEditor, 'category'> & TileConfig

export type LevelType = {
  chunkAmount: number
  chunkSize: number
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
  { type: TileEnum.ElevationUp, category: CategoryEnum.Tool },
  { type: TileEnum.ElevationDown, category: CategoryEnum.Tool },
  { type: TileEnum.Destroy, category: CategoryEnum.Tool },
]