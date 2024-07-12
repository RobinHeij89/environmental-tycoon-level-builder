import { v4 as uuidv4 } from 'uuid';

import { LevelTypeLS, TileEnum, TileType } from "../types";

export const LocalStorageList = ({ levelsLS, setLevelsLS, setTiles }: { levelsLS: LevelTypeLS[], setLevelsLS: React.Dispatch<React.SetStateAction<LevelTypeLS[]>>, setTiles: React.Dispatch<React.SetStateAction<LevelTypeLS | null>> }) => {

  const startNewLevel = () => {
    const newTiles: TileType[] = [];
    Array.from({ length: 16 }).map((_, y) => {
      Array.from({ length: 16 }).map((_, x) => {
        newTiles.push({ x, y, type: TileEnum.Grass });
      })
    });
    const uuid = uuidv4();
    const newLevel: LevelTypeLS = {
      uuid: uuid,
      displayName: uuid,
      gridSizeX: 16,
      gridSizeY: 16,
      gridList: newTiles,
      roadTiles: [],
      previewTiles: []
    }
    setTiles(newLevel);
    setLevelsLS(old => {
      return [
        ...old,
        newLevel
      ]
    }
    );
  }

  const clearLS = () => {
    if (confirm('Are you sure you want to clear the local storage?')) {
      setTiles(null);
      setLevelsLS([]);
    }
  }

  return (
    <div>
      <h1>Level List</h1>
      <ul>
        <li>
          <button onClick={startNewLevel}>Start new level</button>
        </li>
        {levelsLS.map((level) => {
          return (
            <li key={level.uuid}>
              <button onClick={() => setTiles(level)}>{level.displayName}</button>
            </li>
          )
        }
        )}
      </ul>

      {levelsLS.length > 0 && (
        <fieldset>
          <legend>Clear the entire local storage</legend>
          <p><b>You will lose everything you don't have in JSON files...</b></p>
          <button onClick={clearLS}>Clear local storage</button>
        </fieldset>
      )}
    </div>
  )
}