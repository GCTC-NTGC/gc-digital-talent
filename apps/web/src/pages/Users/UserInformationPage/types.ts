import { User, Pool } from "~/api/generated";

export interface BasicUserInformationProps {
  user: User;
}

export interface UserInformationProps extends BasicUserInformationProps {
  pools: Pool[];
}
