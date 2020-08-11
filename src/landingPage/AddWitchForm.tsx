import React, { FC } from 'react';
import {
  Actor,
  Machine,
} from 'xstate';

import { gql } from '@apollo/client';
import { assign } from '@xstate/immer';
import { useService } from '@xstate/react';

import { client } from '../client';

const ADD_WITCH = gql`
mutation CreateWitch($data:PersonInput!) {
  createPerson(data:$data) {
    name
  }
}
`;

export interface IWitch {
  name: string;
  reputation: number;
  role: 'witch';
}

type TAddWitchContext = {
  error: string;
  data: IWitch
}

type TAddWitchEvent = { type: 'UPDATE', name: string }
  | { type: 'SAVE' };

export const addWitchMachine = Machine<TAddWitchContext, TAddWitchEvent>({
  id: 'addWitchMachine',
  initial: 'active',
  context: {
    data: {
      name: '',
      reputation: 0,
      role: 'witch',
    },
    error: '',
  },
  states: {
    active: {
      on: {
        UPDATE: {
          actions: ['clearError', 'setName'],
        },
        SAVE: 'saving',
      }
    },
    saving: {
      invoke: {
        src: 'saveWitch',
        onDone: 'finished',
        onError: {
          target: 'active',
          actions: 'setError',
        }
      }
    }
    ,
    finished: {
      type: 'final',
      data: (ctx) => {
        return {
          name: ctx.data.name,
        }
      }
    }
  }
}, {
  actions: {
    clearError: assign((context) => context.error = ''),
    setError: assign((context, event: any) => context.error = event.data),
    setName: assign((context, event: any) => context.data.name = event.name),
  },
  services: {
    saveWitch: async (state) => {
      const res = await client.mutate({
        mutation: ADD_WITCH,
        variables: { data: state.data },
      })
      if (res.errors) {
        return Promise.reject('bad witch');
      }
      return Promise.resolve();
    }
  }
})

interface IProps {
  service?: Actor;
}
export const AddWitchForm: FC<IProps> = ({
  service,
}) => {
  const [state, send] = useService<TAddWitchContext, TAddWitchEvent>(service as any);
  return (<form>
    {
      state.context.error !== '' &&
      <p>error: {state.context.error}</p>
    }
    <input name="witch"
      onChange={(e: any) => send({ type: 'UPDATE', name: e.target.value })} />
    <button type="button"
      onClick={() => {
        send({ type: 'SAVE' })
      }}>Add</button>
  </form>)
}
