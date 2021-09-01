import React, { ReactElement } from "react";

export const SideMenu: React.FunctionComponent<{
  items: ReactElement[];
}> = ({ items }) => {
  return (
    <nav>
      <ul
        style={{
          listStyle: "none",
          margin: "0",
          padding: "0",
        }}
      >
        {items.map((item) => {
          return (
            <li
              key={item.key}
              style={{
                margin: "0",
              }}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideMenu;
