import clsx from "clsx"

import { TileEnum } from "../types"
import { tileEnumToClass } from "./helpers"
import style from './tile.module.css'

type TileProps = {
  showCoords: boolean
  onMouseEnter?: () => void
  onMouseDown?: () => void
  onMouseUp?: () => void
  tileType?: TileEnum
  x: number
  y: number
  isValid?: boolean
}

export const Tile = ({ onMouseEnter, onMouseDown, onMouseUp, tileType, x, y, isValid = true, showCoords = false }: TileProps) => {
  return (
    <div
      className={clsx(style.tile, tileType ? style[tileEnumToClass(tileType)] : '', isValid ? style.valid : style.invalid)}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
    >
      {showCoords && (<span>{x}, {y}</span>)}
    </div>
  )
}