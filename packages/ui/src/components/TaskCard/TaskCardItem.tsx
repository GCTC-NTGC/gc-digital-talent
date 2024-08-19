import { ReactNode } from "react";

export interface TaskCardItemProps {
  children?: ReactNode;
}

const TaskCardItem = ({ children }: TaskCardItemProps) => {
  return (
    <div
      data-h2-padding="base(x1) p-tablet(x1 x1.5)"
      data-h2-border-bottom="base:selectors[:not(:last-child)](1px solid gray.lighter)"
    >
      {children}
    </div>
  );
};

export default TaskCardItem;
