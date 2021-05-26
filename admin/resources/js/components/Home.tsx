import { gql, useQuery } from "@apollo/client";
import * as React from "react";

interface HomeProps {}
type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const GET_USERS = gql`
  query {
    users {
      id
      firstName
      lastName
      email
    }
  }
`;

const Home: React.FunctionComponent<HomeProps> = (props) => {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Fetching Users...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <section data-h2-container="b(center, m)">
      <div
        data-h2-bg-color="b(white)"
        data-h2-padding="b(top-bottom, m) m(all, l)"
        data-h2-radius="b(s)"
        data-h2-shadow="b(s) m(m)"
        data-h2-margin="b(bottom, s)"
      >
        <p data-h2-text-align="b(center)">
          Welcome to <span data-h2-font-color="b(black)">GC Talent</span>!
        </p>
      </div>
      {data.users.map((user: User) => (
        <div key={user.id} data-h2-display="b(flex)">
          <span data-h2-margin="b(bottom-right, s)">
            Fullname: {user.lastName}, {user.firstName}
          </span>
          <span data-h2-margin="b(bottom-right, s)">Email: {user.email}</span>
        </div>
      ))}
    </section>
  );
};

export default Home;
