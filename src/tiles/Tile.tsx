import clsx from "clsx"
import style from './tile.module.css'
import { TileEnum } from "../types"
import { tileEnumToClass } from "./helpers"

type TileProps = {
  onMouseEnter?: () => void
  onMouseDown?: () => void
  onMouseUp?: () => void
  tileType?: TileEnum
  x: number
  y: number
  isValid?: boolean
}

export const Tile = ({ onMouseEnter, onMouseDown, onMouseUp, tileType, x, y, isValid = true }: TileProps) => {
  return (
    <div
      className={clsx(style.tile, tileType ? style[tileEnumToClass(tileType)] : '', isValid ? style.valid : style.invalid)}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
    >
      <span>{x}, {y} {tileType}</span>
    </div>
  )
}