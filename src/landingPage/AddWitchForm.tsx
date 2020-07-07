import { gql } from 'apollo-boost';
import React, { FC } from 'react';
import {
  Interpreter,
  Machine,
} from 'xstate';

import { useMutation } from '@apollo/react-hooks';
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

export const addWitchMachine = Machine<any, any, any>({
  id: 'addWitchMachine',
  initial: 'active',
  context: {
    name: '',
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
          name: ctx.name,
        }
      }
    }
  }
}, {
  actions: {
    clearError: assign((context) => context.error = ''),
    setError: assign((context, event) => context.error = event.data),
    setName: assign((context: any, event: any) => context.name = event.name),
  },
  services: {
    saveWitch: async () => {
      console.log('save witch');
      const res = await client.mutate({
        mutation: ADD_WITCH,
      })
      console.log('res', res);
      return Promise.reject('bad witch');
    }
  }
})

interface IProps {
  intepreter: Interpreter<any>;
}
export const AddWitchForm: FC<IProps> = ({
  intepreter,
}) => {
  console.log('intepreter', intepreter);
  // const service = intepreter.children.get('addWitchMachine');
  // if (!)
  const [state, send] = useService<any, any>(intepreter.children.get('addWitchMachine') as any);
  console.log('state', state);
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
