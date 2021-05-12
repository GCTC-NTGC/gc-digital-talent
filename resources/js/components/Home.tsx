import * as React from "react";

interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = (props) => {
  return (
    <section data-h2-container="b(center, m)">
      <div
        data-h2-bg-color="b(white)"
        data-h2-padding="b(top-bottom, m) m(all, l)"
        data-h2-radius="b(s)"
        data-h2-shadow="b(s) m(m)"
      >
        <p data-h2-text-align="b(center)">
          Welcome to <span data-h2-font-color="b(black)">GC Talent</span>!
        </p>
      </div>
    </section>
  );
};

export default Home;
