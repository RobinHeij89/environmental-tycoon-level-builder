import { v4 as uuidv4 } from 'uuid';

import { LevelTypeLS, TileEnum, TileType } from "../types";
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { Divider } from 'primereact/divider';
import { Fieldset } from 'primereact/fieldset';

export const LocalStorageList = ({ levelsLS, setLevelsLS, tiles, setTiles }: { levelsLS: LevelTypeLS[], setLevelsLS: React.Dispatch<React.SetStateAction<LevelTypeLS[]>>, tiles: LevelTypeLS | null, setTiles: React.Dispatch<React.SetStateAction<LevelTypeLS | null>> }) => {

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
      <Button onClick={startNewLevel}>Start new level</Button>
      <Divider />

      <ListBox
        value={levelsLS.find(level => level.uuid === tiles?.uuid)}
        onChange={(e) => setTiles(e.value)}
        options={levelsLS}
        optionLabel="displayName"
      />
      <Divider />

      {levelsLS.length > 0 && (
        <Fieldset legend='Clear local storage'>
          <p><b>You will lose everything you don't have in JSON files...</b></p>
          <button onClick={clearLS}>Clear local storage</button>
        </Fieldset>
      )}
    </div>
  )
}