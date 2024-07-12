import clsx from 'clsx'

import { removeOutOfBounds } from '../grid/helpers'
import { Todo } from '../todo/todo'
import { availableTiles, AvailableTileType, CategoryEnum, Coord, LevelTypeLS, TileEnum } from '../types'
import style from './sidebar.module.css'
export interface SidebarProps {
  tiles: LevelTypeLS,
  setTiles: React.Dispatch<React.SetStateAction<LevelTypeLS>>,
  tileToSet: AvailableTileType | undefined,
  setTileToSet: React.Dispatch<React.SetStateAction<AvailableTileType | undefined>>,
  isDragging: boolean,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
  startPos: Coord | undefined,
  setStartPos: React.Dispatch<React.SetStateAction<Coord | undefined>>,
  endPos: Coord | undefined,
  setEndPos: React.Dispatch<React.SetStateAction<Coord | undefined>>,
}

export const Sidebar = ({
  tiles,
  setTiles,
  tileToSet, setTileToSet,
  isDragging,
  startPos,
  endPos,
}: SidebarProps) => {
  const incorrectDataLength = tiles.gridList.length > (tiles.gridSizeX * tiles.gridSizeY)

  const returnKeyByIndex = (index: string) => {
    const indexNmbr = parseInt(index, 10)
    return Object.keys(TileEnum)[indexNmbr];
  }

  const availableTilesTerrain = availableTiles.filter(tile => tile.category === CategoryEnum.Terrain);
  const availableTilesRoad = availableTiles.filter(tile => tile.category === CategoryEnum.Road);
  const availableTilesBuilding = availableTiles.filter(tile => tile.category === CategoryEnum.Building);
  const availableTilesTool = availableTiles.filter(tile => tile.category === CategoryEnum.Tool);

  return (
    <aside className={style.sidebar}>
      <div>
        <h1>Level editor</h1>
        <fieldset>
          <legend>Change grid size:</legend>
          <p>x: <input type="number" value={tiles.gridSizeX} onChange={e => setTiles({ ...tiles, gridSizeX: parseInt(e.target.value) })} /></p>
          <p>y: <input type="number" value={tiles.gridSizeY} onChange={e => setTiles({ ...tiles, gridSizeY: parseInt(e.target.value) })} /></p>
          {incorrectDataLength && (<button onClick={() => removeOutOfBounds(setTiles)}>Remove out of bounds tiles</button>)}
        </fieldset>


        {availableTilesTerrain.length > 0 && (
          <fieldset>
            <legend>Terrain:</legend>
            <ul className={style.buildlist}>
              {
                availableTilesTerrain.map(tile => (
                  <li key={tile.type}>
                    <button className={clsx(style.tilebutton, style[returnKeyByIndex(tile.type).toLowerCase()], tileToSet?.type === tile.type && style.active)} onClick={() => setTileToSet(tile)} />
                  </li>
                ))
              }
            </ul>
          </fieldset>
        )}

        {availableTilesRoad.length > 0 && (
          <fieldset>
            <legend>Road:</legend>
            <ul className={style.buildlist}>
              {
                availableTilesRoad.map(tile => (
                  <li key={tile.type}>
                    <button className={clsx(style.tilebutton, style[returnKeyByIndex(tile.type).toLowerCase()], tileToSet?.type === tile.type && style.active)} onClick={() => setTileToSet(tile)} />
                  </li>
                ))
              }
            </ul>
          </fieldset>
        )}

        {availableTilesBuilding.length > 0 && (
          <fieldset>
            <legend>Buildings:</legend>
            <ul className={style.buildlist}>
              {
                availableTilesBuilding.map(tile => (
                  <li key={tile.type}>
                    <button className={clsx(style.tilebutton, style[returnKeyByIndex(tile.type).toLowerCase()], tileToSet?.type === tile.type && style.active)} onClick={() => setTileToSet(tile)} />
                  </li>
                ))
              }
            </ul>
          </fieldset>
        )}

        {availableTilesTool.length > 0 && (
          <fieldset>
            <legend>Tools:</legend>
            <ul className={style.buildlist}>
              {
                availableTilesTool.map(tile => (
                  <li key={tile.type}>
                    <button className={clsx(style.tilebutton, style[returnKeyByIndex(tile.type).toLowerCase()], tileToSet?.type === tile.type && style.active)} onClick={() => setTileToSet(tile)} />
                  </li>
                ))
              }
            </ul>
          </fieldset>
        )}

        {(startPos || isDragging || endPos) && (
          <fieldset>
            <legend>Debug:</legend>
            {startPos && <p>Start position: {startPos.x}, {startPos.y}</p>}
            {isDragging && <p>Dragging...</p>}
            {endPos && <p>End position: {endPos.x}, {endPos.y}</p>}
          </fieldset>
        )}

      </div>

      <div>

        <details>
          <summary>Code:</summary>
          <pre className={style.pre}>
            {JSON.stringify(tiles, null, 2)}
          </pre>      </details>
        <details>
          <summary>To do:</summary>
          <Todo />
        </details>
      </div>

    </aside>
  )
}