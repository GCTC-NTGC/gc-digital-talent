import { UpdateUserAsUserInput, User } from "~/api/generated";

export interface SectionProps {
  user: User;
  onUpdate: (data: UpdateUserAsUserInput, message?: React.ReactNode) => void;
}
