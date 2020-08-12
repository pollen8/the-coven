import React, {
  FC,
  useEffect,
} from 'react';

import { useService } from '@xstate/react';

interface IProps {
  interpreter: any;
}
export const Cupboard: FC<IProps> = ({
  interpreter,
}) => {
  const service = interpreter.children.get('cupboardMachine');
  const [state, send] = useService<any, any>(service as any);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        send({ type: 'CLOSE' });
      }
    }
    document.addEventListener('keydown', esc);

    return () => document.removeEventListener('keydown', esc);
  }, [send]);
  console.log('state cup', state);
  return (<div><h3>Cupboard</h3>

  </div>)
}