import { User, Pool, Department } from "@gc-digital-talent/graphql";

export interface BasicUserInformationProps {
  user: User;
}

export interface UserInformationProps extends BasicUserInformationProps {
  pools: Pool[];
  departments?: Department[];
}
