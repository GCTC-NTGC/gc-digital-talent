import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import { useReactToPrint } from "react-to-print";

import {
  Button,
  DropdownMenu,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import UserProfile from "~/components/UserProfile";
import { User, Scalars, useGetViewUserDataQuery } from "~/api/generated";
import AdminAboutUserSection from "~/components/AdminAboutUserSection/AdminAboutUserSection";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";
import ProfileDocument from "~/components/ProfileDocument/ProfileDocument";
import printStyles from "~/styles/printStyles";

interface AdminUserProfileProps {
  user: User;
}

export const AdminUserProfile = ({ user }: AdminUserProfileProps) => {
  const intl = useIntl();
  const [
    documentWithIdentifyingInformation,
    setDocumentWithIdentifyingInformation,
  ] = useState(true);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: intl.formatMessage({
      defaultMessage: "Candidate profile",
      id: "mVmrEn",
      description: "Document title for printing User profile",
    }),
  });
  useEffect(() => {
    handlePrint();
  }, [documentWithIdentifyingInformation, handlePrint]);

  return (
    <>
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-text-align="base(right)"
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button utilityIcon={ChevronDownIcon}>
              {intl.formatMessage({
                defaultMessage: "Print profile",
                id: "Yr0nVZ",
                description: "Text label for button to print items in a table",
              })}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" collisionPadding={2}>
            <DropdownMenu.Item
              onSelect={() => {
                setDocumentWithIdentifyingInformation(true);
              }}
            >
              Print with all information
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => {
                setDocumentWithIdentifyingInformation(false);
              }}
            >
              Print with unidentified information
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <UserProfile
        user={user}
        headingLevel="h3"
        sections={{
          about: {
            isVisible: true,
            override: <AdminAboutUserSection user={user} />,
          },
          language: { isVisible: true },
          government: { isVisible: true },
          workLocation: { isVisible: true },
          workPreferences: { isVisible: true },
          employmentEquity: { isVisible: true },
          careerTimelineAndRecruitment: { isVisible: true },
        }}
      />
      <ProfileDocument
        anonymous={documentWithIdentifyingInformation}
        results={[user]}
        ref={componentRef}
      />
    </>
  );
};

type RouteParams = {
  userId: Scalars["ID"];
};

const AdminUserProfilePage = () => {
  const { userId } = useParams<RouteParams>();
  const intl = useIntl();
  const routes = useRoutes();
  const [{ data: lookupData, fetching, error }] = useGetViewUserDataQuery({
    variables: { id: userId || "" },
  });

  const user = lookupData?.user;

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.users),
      url: routes.userTable(),
    },
    ...(userId
      ? [
          {
            label: getFullNameLabel(user?.firstName, user?.lastName, intl),
            url: routes.userView(userId),
          },
        ]
      : []),
    ...(userId
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Profile",
              id: "1wONOC",
              description: "User profile breadcrumb text",
            }),
            url: routes.userProfile(userId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Candidate details",
          id: "dj8GiH",
          description: "Page title for the individual user page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        {user ? <AdminUserProfile user={user} /> : <ThrowNotFound />}
      </Pending>
    </AdminContentWrapper>
  );
};

export default AdminUserProfilePage;
