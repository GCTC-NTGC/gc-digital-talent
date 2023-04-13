import {
  Scalars,
  UpdateUserAboutMeMutation,
  UpdateUserAsUserInput,
  User,
} from "~/api/generated";

export interface SectionProps {
  user: User;
  onUpdate: (
    id: string,
    user: UpdateUserAsUserInput,
  ) => Promise<UpdateUserAboutMeMutation["updateUserAsUser"]>;
}
