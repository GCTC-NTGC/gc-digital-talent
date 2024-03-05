import { User, Pool } from "@gc-digital-talent/graphql";

export interface BasicUserInformationProps {
  user: User;
}

export interface UserInformationProps extends BasicUserInformationProps {
  pools: Pool[];
}
