import React, { FC } from 'react';

interface IProps {
  send: (action: any) => void;
  state: any;
}

export const PropForm: FC<IProps> = ({
  state,
  send,
}) => {
  return (
    <>
      <h3>add prop</h3>
      <label htmlFor="prop-title">Name</label>
      <input type="text"
        id="prop-title"
        onBlur={(e: any) => send({ type: 'UPDATE', key: 'title', value: e.target.value })}
      />
      <label htmlFor="prop-description">Description</label>
      <textarea id="prop-description"
        onBlur={(e: any) => send({ type: 'UPDATE', key: 'description', value: e.target.value })}>
      </textarea>
      <label htmlFor="prop-value">Value</label>
      <input type="number"
        id="prop-value"
        onBlur={(e: any) => send({ type: 'UPDATE', key: 'value', value: e.target.value })} />
      <button onClick={() => send({
        type: 'UPDATE_TILE',
        position: state.context.dropPosition,
        item: { ...state.context.prop, type: 'PROP' },
      })}>
        Save
        </button>
      <button
        onClick={() => send({ type: 'CANCEL' })}>Cancel</button>
    </>
  )
}
