import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card, Heading, Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";

import CandidateNavigation from "../CandidateNavigation/CandidateNavigation";
import ApplicationStatusMeta from "./ApplicationStatusMeta/ApplicationStatusMeta";
import ApplicationStatusDialog from "./Dialog/ApplicationStatusDialog/ApplicationStatusDialog";
import ApplicantContactInformation from "./ApplicantContactInformation";
import ApplicationBookmarkFlag from "./ApplicationBookmarkFlag";

export const ApplicationSidebar_Fragment = graphql(/** GraphQL **/ `
  fragment ApplicationSidebar on PoolCandidate {
    id
    user {
      id
      firstName
      lastName
    }
    ...ApplicationStatusDialog
    ...ApplicationStatusMeta
    ...ApplicantContactInformation
    ...ApplicationBookmarkFlag
  }
`);

interface ApplicationSidebarProps {
  query: FragmentType<typeof ApplicationSidebar_Fragment>;
}

const ApplicationSidebar = ({ query }: ApplicationSidebarProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const application = getFragment(ApplicationSidebar_Fragment, query);

  return (
    <>
      <Card className="mb-3 flex flex-col gap-y-6">
        <div className="flex justify-between gap-3">
          <div className="grow">
            <Heading size="h6" className="my-0">
              <Link
                mode="inline"
                color="black"
                href={paths.userView(application.user.id)}
              >
                {getFullNameLabel(
                  application.user.firstName,
                  application.user.lastName,
                  intl,
                )}
              </Link>
            </Heading>
          </div>
        </div>
        <Card.Separator />
        <ApplicationStatusDialog query={application} />
        <ApplicationStatusMeta query={application} />
        <Card.Separator />
        <ApplicantContactInformation query={application} />
        <Card.Separator />
        <ApplicationBookmarkFlag query={application} />
        <Card.Separator />
      </Card>
      <CandidateNavigation candidateId={application.id} />
    </>
  );
};

export default ApplicationSidebar;
