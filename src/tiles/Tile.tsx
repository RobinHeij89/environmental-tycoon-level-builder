import clsx from "clsx"

import { TileEnum } from "../types"
import { tileEnumToClass } from "./helpers"
import style from './tile.module.css'

type TileProps = {
  showCoords: boolean
  showGrid: boolean
  showTreeHM: boolean
  showElevation: boolean
  onMouseEnter?: () => void
  onMouseDown?: () => void
  onMouseUp?: () => void
  tileType?: TileEnum
  elevation: number
  treeHM: number
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

export const Tile = ({ showElevation, neighbours, onMouseEnter, onMouseDown, onMouseUp, showTreeHM, treeHM, tileType, elevation, x, y, isValid = true, showCoords = false, showGrid = true, isPreview = false }: TileProps) => {
  const Dithers = [];

  if (tileType === TileEnum.Grass) {

    // TODO: fix this
    if (neighbours.top === TileEnum.Water && neighbours.left === TileEnum.Water && neighbours.right === TileEnum.Water && neighbours.bottom === TileEnum.Water) {
      Dithers.push(style['water-top-left-right-bottom']);
    } else if (neighbours.top === TileEnum.Water && neighbours.left === TileEnum.Water && neighbours.bottom === TileEnum.Water) {
      Dithers.push(style['water-top-left-bottom']);
    } else if (neighbours.top === TileEnum.Water && neighbours.right === TileEnum.Water && neighbours.bottom === TileEnum.Water) {
      Dithers.push(style['water-top-right-bottom']);
    } else if (neighbours.top === TileEnum.Water && neighbours.left === TileEnum.Water && neighbours.right === TileEnum.Water) {
      Dithers.push(style['water-top-left-right']);
    } else if (neighbours.left === TileEnum.Water && neighbours.right === TileEnum.Water && neighbours.bottom === TileEnum.Water) {
      Dithers.push(style['water-left-right-bottom']);
    } else if (neighbours.top === TileEnum.Water && neighbours.left === TileEnum.Water) {
      Dithers.push(style['water-top-left']);
    } else if (neighbours.top === TileEnum.Water && neighbours.right === TileEnum.Water) {
      Dithers.push(style['water-top-right']);
    } else if (neighbours.bottom === TileEnum.Water && neighbours.right === TileEnum.Water) {
      Dithers.push(style['water-bottom-right']);
    } else if (neighbours.top === TileEnum.Water && neighbours.bottom === TileEnum.Water) {
      Dithers.push(style['water-top-bottom']);
    } else if (neighbours.top === TileEnum.Water) {
      Dithers.push(style['water-top']);
    } else if (neighbours.right === TileEnum.Water) {
      Dithers.push(style['water-right']);
    } else if (neighbours.bottom === TileEnum.Water) {
      Dithers.push(style['water-bottom']);
    } else if (neighbours.left === TileEnum.Water) {
      Dithers.push(style['water-left']);
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
          isPreview ? style.preview : '',
          ...Dithers
        )
      }
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
    >
      {/* {Dithers.map((dither, index) => (
        <div key={index} className={style.dither}>
          {dither}
        </div>
      ))} */}
      {showCoords && (<span>{x}, {y}</span>)}
      {showTreeHM && (<span className={style.tree} style={{ opacity: treeHM / 10 }}>{treeHM}</span>)}
      {showElevation && (<span className={style.elevation}>{elevation}</span>)}
    </div>
  )
}