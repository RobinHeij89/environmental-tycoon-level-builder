import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Fieldset } from 'primereact/fieldset';
import { ListBox } from 'primereact/listbox';
import { v4 as uuidv4 } from 'uuid';

import { LevelTypeLS, TileEnum, TileType } from "../types";
import Perlin from '../perlin';

export const LocalStorageList = ({ levelsLS, setLevelsLS, tiles, setTiles }: { levelsLS: LevelTypeLS[], setLevelsLS: React.Dispatch<React.SetStateAction<LevelTypeLS[]>>, tiles: LevelTypeLS | null, setTiles: React.Dispatch<React.SetStateAction<LevelTypeLS | null>> }) => {
  const seed = Math.floor(Math.random() * 65535) + 1;
  const noise = new Perlin(seed);
  const multiplier = 5;

  const startNewLevel = () => {
    const newTiles: TileType[] = [];
    Array.from({ length: 16 }).map((_, y) => {
      Array.from({ length: 16 }).map((_, x) => {
        const treeHM = Math.floor(noise.perlin2(x / 100, y / 100) * multiplier + multiplier);
        newTiles.push({ x, y, type: TileEnum.Grass, elevation: 1, treeHM: treeHM });
      })
    });
    const uuid = uuidv4();
    const newLevel: LevelTypeLS = {
      uuid: uuid,
      displayName: uuid,
      treeSeed: seed,
      chunkAmount: 2, //pow()
      chunkSize: 4,
      gridTiles: newTiles,
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