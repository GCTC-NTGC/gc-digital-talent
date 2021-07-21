import React, { ReactElement } from "react";
import Button from "../H2Components/Button";

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
            <li key={item.key}>
              <Button color="white" mode="solid" block>
                {item}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideMenu;
