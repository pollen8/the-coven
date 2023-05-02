import { PropsWithChildren } from 'react';

export const GameObject = ({
  children,
}: PropsWithChildren<unknown>) => {
  return (
    <>
      {children}
    </>
  );
};
