import { ReactNode } from "react";

import ActivityContainer from "./ActivityContainer";

interface ActivityProviderProps {
  children?: ReactNode;
}

const ActivityProvider = ({ children }: ActivityProviderProps) => {
  return <ActivityContainer>{children}</ActivityContainer>;
};

export default ActivityProvider;
