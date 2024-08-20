import clsx from "clsx"

import { TileEnum } from "../types"
import style from './tile.module.css'

type DualGridTileProps = {
  tiles: {
    topLeft?: TileEnum
    topRight?: TileEnum
    bottomLeft?: TileEnum
    bottomRight?: TileEnum
  }
}

export const DualGridTile = ({ tiles}: DualGridTileProps) => {
  const tileClass = () => {
    
    if (
      tiles.topLeft === TileEnum.Grass &&
      tiles.topRight === TileEnum.Water &&
      tiles.bottomLeft === TileEnum.Water &&
      tiles.bottomRight === TileEnum.Water
    ) {
      return style['grass_top_left']
    }
    if (
      tiles.topLeft === TileEnum.Water &&
      tiles.topRight === TileEnum.Grass &&
      tiles.bottomLeft === TileEnum.Water &&
      tiles.bottomRight === TileEnum.Water
    ) {
      return style['grass_top_right']
    }
    if (
      tiles.topLeft === TileEnum.Water &&
      tiles.topRight === TileEnum.Water &&
      tiles.bottomLeft === TileEnum.Grass &&
      tiles.bottomRight === TileEnum.Water
    ) {
      return style['grass_bottom_left']
    }
    if (
      tiles.topLeft === TileEnum.Water &&
      tiles.topRight === TileEnum.Water &&
      tiles.bottomLeft === TileEnum.Water &&
      tiles.bottomRight === TileEnum.Grass
    ) {
      return style['grass_bottom_right']
    }


    if (
      tiles.topLeft === TileEnum.Grass &&
      tiles.topRight === TileEnum.Grass &&
      tiles.bottomLeft === TileEnum.Water &&
      tiles.bottomRight === TileEnum.Water
    ) {
      return style['water_bottom']
    }
    if (
      tiles.topLeft === TileEnum.Water &&
      tiles.topRight === TileEnum.Water &&
      tiles.bottomLeft === TileEnum.Grass &&
      tiles.bottomRight === TileEnum.Grass
    ) {
      return style['water_top']
    }
    if (
      tiles.topLeft === TileEnum.Water &&
      tiles.topRight === TileEnum.Grass &&
      tiles.bottomLeft === TileEnum.Water &&
      tiles.bottomRight === TileEnum.Grass
    ) {
      return style['water_left']
    }
    if (
      tiles.topLeft === TileEnum.Grass &&
      tiles.topRight === TileEnum.Water &&
      tiles.bottomLeft === TileEnum.Grass &&
      tiles.bottomRight === TileEnum.Water
    ) {
      return style['water_right']
    }
  if (
    tiles.topLeft === TileEnum.Grass &&
    tiles.topRight === TileEnum.Grass &&
    tiles.bottomLeft === TileEnum.Grass &&
    tiles.bottomRight === TileEnum.Water
  ) {
    return style['water_bottom_right']
  }
  if (
    tiles.topLeft === TileEnum.Grass &&
    tiles.topRight === TileEnum.Grass &&
    tiles.bottomLeft === TileEnum.Water &&
    tiles.bottomRight === TileEnum.Grass
  ) {
    return style['water_bottom_left']
  }
  if (
    tiles.topLeft === TileEnum.Grass &&
    tiles.topRight === TileEnum.Water &&
    tiles.bottomLeft === TileEnum.Grass &&
    tiles.bottomRight === TileEnum.Grass
  ) {
    return style['water_top_right']
  }
  if (
    tiles.topLeft === TileEnum.Water &&
    tiles.topRight === TileEnum.Grass &&
    tiles.bottomLeft === TileEnum.Grass &&
    tiles.bottomRight === TileEnum.Grass
  ) {
    return style['water_top_left']
  }
    
  if (
    tiles.topLeft === TileEnum.Water &&
    tiles.topRight === TileEnum.Water &&
    tiles.bottomLeft === TileEnum.Water &&
    tiles.bottomRight === TileEnum.Water
  ) {
    return style.water
  }
    if (
      tiles.topLeft === TileEnum.Grass &&
      tiles.topRight === TileEnum.Grass &&
      tiles.bottomLeft === TileEnum.Grass &&
      tiles.bottomRight === TileEnum.Grass
    ) {
      return style.grass
    }
  }

  return (
    <div
      className={
        clsx(
          style.tile,
          style.valid,
          style.dualtile,
          tileClass()
        )
      }
    >
    </div>
  )
}