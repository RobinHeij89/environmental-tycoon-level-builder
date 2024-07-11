import clsx from 'clsx'

import { removeOutOfBounds } from '../grid/helpers'
import { getTileType } from '../tiles/helpers'
import { Todo } from '../todo/todo'
import { AvailableTileType, Coord, LevelType, TileEnum } from '../types'
import style from './sidebar.module.css'

interface Props {
  tiles: LevelType,
  setTiles: React.Dispatch<React.SetStateAction<LevelType>>,
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
}: Props) => {
  const incorrectDataLength = tiles.gridList.length > (tiles.gridSizeX * tiles.gridSizeY)

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


        <fieldset>
          <legend>Build tiles:</legend>
          <ul className={style.buildlist}>
            <li><button className={clsx(style.tilebutton, style.water, tileToSet === getTileType(TileEnum.Water) && style.active)} onClick={() => setTileToSet(getTileType(TileEnum.Water))}>Water</button></li>
            <li><button className={clsx(style.tilebutton, style.grass, tileToSet === getTileType(TileEnum.Grass) && style.active)} onClick={() => setTileToSet(getTileType(TileEnum.Grass))}>Grass</button></li>
            <li><button className={clsx(style.tilebutton, style.road, tileToSet === getTileType(TileEnum.Road) && style.active)} onClick={() => setTileToSet(getTileType(TileEnum.Road))}>Road</button></li>
          </ul>
          {startPos && <p>Start position: {startPos.x}, {startPos.y}</p>}
          {isDragging && <p>Dragging...</p>}
          {endPos && <p>End position: {endPos.x}, {endPos.y}</p>}
        </fieldset>

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