import clsx from 'clsx'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Fieldset } from 'primereact/fieldset'
import { InputNumber } from 'primereact/inputnumber'

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
  const incorrectDataLength = tiles.gridTiles.length > (Math.pow(tiles.chunkAmount, 2) * Math.pow(tiles.chunkSize, 2))

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

        <Fieldset legend='Grid size' toggleable collapsed>
          <p>Chunk size: <InputNumber value={tiles.chunkSize} onChange={e => setTiles({ ...tiles, chunkSize: e.value ?? -1 })} /></p>
          <p>Amonut of chunks: <InputNumber value={tiles.chunkAmount} onChange={e => setTiles({ ...tiles, chunkAmount: e.value ?? -1 })} />
            <br />
            This number will be multiplied with the power of 2, so this will result in {Math.pow(tiles.chunkAmount, 2)} tiles.</p>
          {incorrectDataLength && (<button onClick={() => removeOutOfBounds(setTiles)}>Remove out of bounds tiles</button>)}
        </Fieldset>


        {availableTilesTerrain.length > 0 && (
          <Fieldset legend='Terrain' toggleable collapsed>
            <ul className={style.buildlist}>
              {
                availableTilesTerrain.map(tile => (
                  <li key={tile.type}>
                    <button className={clsx(style.tilebutton, style[returnKeyByIndex(tile.type).toLowerCase()], tileToSet?.type === tile.type && style.active)} onClick={() => setTileToSet(tile)} />
                  </li>
                ))
              }
            </ul>
          </Fieldset>
        )}

        {availableTilesRoad.length > 0 && (
          <Fieldset legend='Roads' toggleable collapsed>

            <ul className={style.buildlist}>
              {
                availableTilesRoad.map(tile => (
                  <li key={tile.type}>
                    <button className={clsx(style.tilebutton, style[returnKeyByIndex(tile.type).toLowerCase()], tileToSet?.type === tile.type && style.active)} onClick={() => setTileToSet(tile)} />
                  </li>
                ))
              }
            </ul>
          </Fieldset>
        )}

        {availableTilesBuilding.length > 0 && (
          <Fieldset legend='Buildings' toggleable collapsed>

            <ul className={style.buildlist}>
              {
                availableTilesBuilding.map(tile => (
                  <li key={tile.type}>
                    <button className={clsx(style.tilebutton, style[returnKeyByIndex(tile.type).toLowerCase()], tileToSet?.type === tile.type && style.active)} onClick={() => setTileToSet(tile)} />
                  </li>
                ))
              }
            </ul>
          </Fieldset>
        )}

        {availableTilesTool.length > 0 && (
          <Fieldset legend='Tools' toggleable collapsed>

            <ul className={style.buildlist}>
              {
                availableTilesTool.map(tile => (
                  <li key={tile.type}>
                    <button className={clsx(style.tilebutton, style[returnKeyByIndex(tile.type).toLowerCase()], tileToSet?.type === tile.type && style.active)} onClick={() => setTileToSet(tile)} />
                  </li>
                ))
              }
            </ul>
          </Fieldset>
        )}

        {(startPos || isDragging || endPos) && (
          <Fieldset legend='Debug' toggleable collapsed>

            {startPos && <p>Start position: {startPos.x}, {startPos.y}</p>}
            {isDragging && <p>Dragging...</p>}
            {endPos && <p>End position: {endPos.x}, {endPos.y}</p>}
          </Fieldset>
        )}

      </div>

      <div>

        <Accordion activeIndex={-1}>
          <AccordionTab header="Code">
            <pre className={style.pre}>
              {JSON.stringify({
                chunkAmount: tiles.chunkAmount,
                chunkSize: tiles.chunkSize,
                uuid: tiles.uuid,
                displayName: tiles.displayName,
                terrainTiles: tiles.gridTiles,
                roadTiles: tiles.roadTiles
              }, null, 2)}
            </pre>
          </AccordionTab>
        </Accordion>
        <Accordion activeIndex={-1}>
          <AccordionTab header="Todo">
            <Todo />
          </AccordionTab>
        </Accordion>
      </div>

    </aside>
  )
}