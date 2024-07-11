import clsx from "clsx"

import { TileEnum } from "../types"
import { tileEnumToClass } from "./helpers"
import style from './tile.module.css'

type TileProps = {
  showCoords: boolean
  showGrid: boolean
  onMouseEnter?: () => void
  onMouseDown?: () => void
  onMouseUp?: () => void
  tileType?: TileEnum
  x: number
  y: number
  isValid?: boolean
  isPreview?: boolean
}

export const Tile = ({ onMouseEnter, onMouseDown, onMouseUp, tileType, x, y, isValid = true, showCoords = false, showGrid = true, isPreview = false }: TileProps) => {
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
      {showCoords && (<span>{x}, {y}</span>)}
    </div>
  )
}