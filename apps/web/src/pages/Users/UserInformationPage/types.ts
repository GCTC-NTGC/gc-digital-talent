import { Applicant, Pool } from "~/api/generated";

export interface BasicUserInformationProps {
  user: Applicant;
}

export interface UserInformationProps extends BasicUserInformationProps {
  pools: Pool[];
}
