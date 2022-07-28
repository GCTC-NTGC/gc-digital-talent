import React from "react";
import { MenuList as ReachList, type MenuListProps } from "@reach/menu-button";

const MenuList: React.FC<MenuListProps> = (props) => (
  <ReachList
    {...props}
    data-h2-radius="base(s)"
    data-h2-shadow="base(s)"
    data-h2-background-color="base(dt-white)"
    data-h2-margin="base(x.125, 0, 0, 0)"
  />
);

export default MenuList;
