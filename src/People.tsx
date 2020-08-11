import React, { FC } from 'react';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';

const PEOPLE_BY_ROLE = gql`
query($role: Role!) {
  peopleByRole(role: $role) {
    data {
      _id
      name
      role
    }
  }
}
`;

interface IPerson {
  _id: string;
  name: string,
  role: string;
}

interface IProps {
  role: 'witch' | 'villager';
}

export const People: FC<IProps> = ({ role }) => {
  const { loading, error, data } = useQuery<{ peopleByRole: { data: IPerson[] } }>(
    PEOPLE_BY_ROLE,
    { variables: { role } },
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (!data) {
    return null;
  }
  return (
    <>
      {
        data.peopleByRole.data.map((person) => <p key={person._id}>
          {person.name}: {person.role}
        </p>)
      }
    </>
  )
}

