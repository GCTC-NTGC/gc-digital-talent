import React, { ReactElement } from "react";

export const SideMenu: React.FunctionComponent<{
  items: ReactElement[];
}> = ({ items }) => {
  return (
    <nav>
      <ul>
        {items.map((item) => {
          return <li key={item.key}>{item}</li>;
        })}
      </ul>
    </nav>
  );
};

export default SideMenu;
