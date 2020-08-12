import React, { FC } from 'react';
import styled from 'styled-components';

import { tileSize } from './GameUI';
import {
  ITile,
  Tile,
} from './Tile';

interface ISize {
  viewPortCols: number;
  viewPortRows: number;
}

const Grid = styled.div<ISize>`
  display: grid;
  grid-template-columns: repeat(${(props) => `${props.viewPortCols}, ${tileSize}px`});
  grid-template-rows: repeat(${(props) => `${props.viewPortRows}, ${tileSize}px`});
`;

interface IMap {
  area: ITile[][];
  center: { x: number, y: number };
  updateArea?: (props: any) => void;
  viewPortRows?: number;
  viewPortCols?: number;
  send?: (action: any) => void;
}

export const Map: FC<IMap> = ({
  area,
  center,
  children,
  updateArea,
  send,
  viewPortRows = 21,
  viewPortCols = 21,
}) => {
  const viewPort = new Array(viewPortRows * viewPortCols).fill('');

  const areaBounds = {
    left: center.x - (viewPortCols - 1) / 2,
    right: center.x + (viewPortCols - 1) / 2,
    top: center.y - (viewPortRows - 1) / 2,
    bottom: center.y + (viewPortRows - 1) / 2,
  }

  return (
    <>
      <Grid viewPortRows={viewPortRows} viewPortCols={viewPortCols} >
        {
          viewPort.map((v, i) => {
            const col = i % viewPortCols;
            const row = Math.floor(i / viewPortRows);
            const tile = area[Math.max(0, row + areaBounds.top)][col + areaBounds.left];
            return <Tile key={i}
              {...tile}
              send={send}
              onDrop={({ position, item }: any) => {
                updateArea && updateArea({ position, item });
              }}
              position={{ x: row + areaBounds.top, y: col + areaBounds.left }}
            ></Tile>

          })
        }
        {
          children
        }
      </Grid>
    </>
  )
}