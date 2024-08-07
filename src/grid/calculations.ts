import { Coord } from "../types";
import { GridProps } from "./Grid";
import { checkValidTile } from "./helpers";

export const calculateArea = ({ setTiles, tileToSet, tiles }: Partial<GridProps>, start: Coord, end: Coord) => {
  const area: Coord[] = [];

  if (start.y < end.y) {
    for (let y = start.y; y <= end.y; y += 1) {
      if (start.x < end.x) {
        for (let x = start.x; x <= end.x; x += 1) {
          area.push({ x, y });
        }
      } else {
        for (let x = start.x; x >= end.x; x -= 1) {
          area.push({ x, y });
        }
      }
    }
  } else {
    for (let y = start.y; y >= end.y; y -= 1) {
      if (start.x < end.x) {
        for (let x = start.x; x <= end.x; x += 1) {
          area.push({ x, y });
        }
      } else {
        for (let x = start.x; x >= end.x; x -= 1) {
          area.push({ x, y });
        }
      }
    }
  }
  setTiles!(old => {
    return {
      ...old,
      previewTiles: area.map(coord => {
        return {
          ...coord,
          type: tileToSet!.type,
          isValid: checkValidTile({ tileToSet, tiles }, coord.x, coord.y),
          elevation: 1,
          treeHM: -1
        }
      })
    }
  })
}

export const calculateLine = ({ setTiles, tileToSet, tiles }: Partial<GridProps>, start: Coord, end: Coord) => {
  const line1: Coord[] = [];
  const line2: Coord[] = [];
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  const xFirst = dx > dy;

  if (xFirst) {
    // if x first then put in all x values between start and end
    // add to line 1
    if (start.x < end.x) {
      for (let x = start.x; x <= end.x; x += 1) {
        line1.push({ x, y: start.y });
      }
    } else {
      for (let x = start.x; x >= end.x; x -= 1) {
        line1.push({ x, y: start.y });
      }
    }

    // then put in all y values between start and end
    // add to line 2
    if (start.y < end.y) {
      for (let y = start.y; y <= end.y; y += 1) {
        line2.push({ x: end.x, y });
      }
    } else {
      for (let y = start.y; y >= end.y; y -= 1) {
        line2.push({ x: end.x, y });
      }
    }

  } else {
    // if y first then put in all y values between start and end
    // add to line 1
    if (start.y < end.y) {
      for (let y = start.y; y <= end.y; y += 1) {
        line1.push({ x: start.x, y });
      }
    } else {
      for (let y = start.y; y >= end.y; y -= 1) {
        line1.push({ x: start.x, y });
      }
    }

    // then put in all x values between start and end
    // add to line 2
    if (start.x < end.x) {
      for (let x = start.x; x <= end.x; x += 1) {
        line2.push({ x, y: end.y });
      }
    } else {
      for (let x = start.x; x >= end.x; x -= 1) {
        line2.push({ x, y: end.y });
      }
    }
  }

  const lines = [...line1, ...line2].filter((obj1, i, arr) =>
    arr.findIndex(obj2 =>
      ['x', 'y'].every(key => obj2[key as keyof Coord] === obj1[key as keyof Coord])
    ) === i
  ).map(coord => {
    return {
      ...coord,
      type: tileToSet!.type,
      isValid: checkValidTile({ tileToSet, tiles }, coord.x, coord.y),
      elevation: 1,
      treeHM: -1
    }
  })

  setTiles!(old => {
    return {
      ...old,
      previewTiles: lines
    }
  })
}