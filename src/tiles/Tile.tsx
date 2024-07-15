import clsx from "clsx"

import { TileEnum } from "../types"
import { tileEnumToClass } from "./helpers"
import style from './tile.module.css'

type TileProps = {
  showCoords: boolean
  showGrid: boolean
  showElevation: boolean
  onMouseEnter?: () => void
  onMouseDown?: () => void
  onMouseUp?: () => void
  tileType?: TileEnum
  elevation: number
  x: number
  y: number
  isValid?: boolean
  isPreview?: boolean
  neighbours: {
    top?: TileEnum
    right?: TileEnum
    bottom?: TileEnum
    left?: TileEnum
  }
}

export const Tile = ({ showElevation, neighbours, onMouseEnter, onMouseDown, onMouseUp, tileType, elevation, x, y, isValid = true, showCoords = false, showGrid = true, isPreview = false }: TileProps) => {
  const Dithers = [];

  if (tileType === TileEnum.Grass) {
    if (neighbours.top === TileEnum.Water) {
      Dithers.push(<div className={clsx(style.sand, style['water-top'])} />);
    }
    if (neighbours.right === TileEnum.Water) {
      Dithers.push(<div className={clsx(style.sand, style['water-right'])} />);
    }
    if (neighbours.bottom === TileEnum.Water) {
      Dithers.push(<div className={clsx(style.sand, style['water-bottom'])} />);
    }
    if (neighbours.left === TileEnum.Water) {
      Dithers.push(<div className={clsx(style.sand, style['water-left'])} />);
    }
  }

  return (
    <div
      className={
        clsx(
          style.tile,
          showGrid ? style['show-grid'] : '',
          tileType ? style[tileEnumToClass(tileType ?? TileEnum.Grass)] : '',
          isValid ? style.valid : style.invalid,
          isPreview ? style.preview : ''
        )
      }
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
    >
      {Dithers.map((dither, index) => (
        <div key={index} className={style.dither}>
          {dither}
        </div>
      ))}
      {showCoords && (<span>{x}, {y}</span>)}
      {showElevation && (<span>{elevation}</span>)}
    </div>
  )
}