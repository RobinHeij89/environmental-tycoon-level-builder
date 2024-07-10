import clsx from 'clsx'
import { removeOutOfBounds } from '../grid/helpers'
import { Todo } from '../todo/todo'
import { LevelType, AvailableTileType, Coord, TileEnum } from '../types'
import style from './sidebar.module.css'
import { useRef } from 'react'
import { getTileType } from '../tiles/helpers'

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

  const downloadHandler = () => {
    const filename = 'level.json';
    const stipTiles = { ...tiles };
    delete stipTiles.previewTiles;
    const jsonStr = JSON.stringify(tiles);

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const inputFile = useRef(null);
  const onChangeFile = async (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.target) return;
    let file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = e => {
        const target = e.target;
        const result = target?.result;
        result && setTiles(JSON.parse(result as string));
        if (inputFile.current) {
          (inputFile.current as HTMLInputElement).value = '';
        }
      };
    }
  };

  return (
    <aside className={style.sidebar}>
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


      <fieldset>
        <legend>Code:</legend>
        <pre className={style.pre}>
          {JSON.stringify(tiles, null, 2)}
        </pre>
      </fieldset>
      <fieldset>
        <legend>Export:</legend>
        <button onClick={downloadHandler} disabled={incorrectDataLength}>Download JSON</button>
      </fieldset>
      <fieldset>
        <legend>Import:</legend>
        <input
          type="file"
          onChange={onChangeFile}
          ref={inputFile}
        />
      </fieldset>


      <fieldset>
        <legend>To do:</legend>

        <Todo />
      </fieldset>

    </aside>
  )
}