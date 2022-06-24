import React from "react";
import { MenuList as ReachList, type MenuListProps } from "@reach/menu-button";

const MenuList: React.FC<MenuListProps> = (props) => (
  <ReachList
    {...props}
    data-h2-radius="b(s)"
    data-h2-shadow="b(s)"
    data-h2-bg-color="b(white)"
    data-h2-margin="b(top, xxs)"
  />
);

export default MenuList;
