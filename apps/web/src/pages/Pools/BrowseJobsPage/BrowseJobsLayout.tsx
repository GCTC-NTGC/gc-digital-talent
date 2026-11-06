import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/*
 * I don't think it's possible to use a React Router Oulet here
 * since PoolAdvertisementPage is in the subtree but doesn't
 * use this layout
 */
export const Component = ({ children }: Props) => {
  return (
    <>
      <span>Hello layout</span>
      {children}
    </>
  );
};

Component.displayName = "BrowseJobsLayout";

export default Component;
