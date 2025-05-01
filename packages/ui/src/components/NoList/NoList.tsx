import React from "react";

interface NoListProps {
  children: React.ReactNode;
}

const NoList = ({ children, ...rest }: NoListProps) => {
  return (
    <ul data-h2-list-style="base(none)" data-h2-padding="base(0)" {...rest}>
      {children}
    </ul>
  );
};

export default NoList;
