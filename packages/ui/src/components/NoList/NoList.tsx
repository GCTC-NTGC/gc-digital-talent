import React from "react";

interface NoListProps {
  children: React.ReactNode;
}

const NoList = ({ children, ...rest }: NoListProps) => {
  return (
    <ul className="list-none" {...rest}>
      {children}
    </ul>
  );
};

export default NoList;
