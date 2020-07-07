import { gql } from 'apollo-boost';
import React from 'react';

import { useQuery } from '@apollo/react-hooks';

const EXCHANGE_RATES = gql`
query allPeople {
  allPeople(_size:10) {
    data {
    	name  
      role
    }
  }
}
`;

interface IPerson {
  name: string,
  role: string;
}
export const People = () => {
  const { loading, error, data } = useQuery<{ allPeople: { data: IPerson[] } }>(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log('data', data);
  if (!data) {
    return null;
  }
  return (
    <>
      {
        data.allPeople.data.map((person) => <p>{person.name}: {person.role}</p>)
      }
    </>
  )
}

