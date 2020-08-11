import { ITile } from './Tile';

const areaCols = 100;
const areaRows = 100;

const row: ITile[] = new Array(areaCols).fill('').map((v, i) => ({ row: 0, column: i, baseImg: `/tiles/generic-rpg-tile01.png` }))
const defaultArea: ITile[][] = new Array(areaRows).fill(row)
defaultArea.map((r: ITile[]) => r.map((v, i) => ({ ...v, row: i })));
const grid = JSON.parse(localStorage.getItem('map-test') ?? '{}');

const position = { x: 30, y: 20, direction: 'right' };
export {
  areaCols,
  areaRows,
  grid,
  position,
}
