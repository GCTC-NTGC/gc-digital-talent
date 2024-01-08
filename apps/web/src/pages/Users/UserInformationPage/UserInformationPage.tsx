import React from "react";
import { useIntl } from "react-intl";
import CalculatorIcon from "@heroicons/react/24/outline/CalculatorIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";

import { Pending, TableOfContents, ThrowNotFound } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import { Scalars, useGetViewUserDataQuery } from "~/api/generated";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRequiredParams from "~/hooks/useRequiredParams";
import adminMessages from "~/messages/adminMessages";

import AboutSection from "./components/AboutSection";
import { UserInformationProps } from "./types";
import CandidateStatusSection from "./components/CandidateStatusSection";
import NotesSection from "./components/NotesSection";
import EmploymentEquitySection from "./components/EmploymentEquitySection";

const UserInformation = ({ user, pools }: UserInformationProps) => {
  const intl = useIntl();

  const items = [
    {
      id: "about",
      title: intl.formatMessage({
        defaultMessage: "About",
        id: "uutH18",
        description: "Title of the 'About' section of the view-user page",
      }),
      titleIcon: UserIcon,
      content: <AboutSection user={user} />,
    },
    {
      id: "candidate-status",
      title: intl.formatMessage({
        defaultMessage: "Candidate status",
        id: "F00OD4",
        description:
          "Title of the 'Candidate status' section of the view-user page",
      }),
      titleIcon: CalculatorIcon,
      content: <CandidateStatusSection user={user} pools={pools} />,
    },
    {
      id: "notes",
      title: intl.formatMessage(adminMessages.notes),
      titleIcon: PencilSquareIcon,
      content: <NotesSection user={user} />,
    },
    {
      id: "employment-equity",
      title: intl.formatMessage(commonMessages.employmentEquity),
      titleIcon: InformationCircleIcon,
      content: <EmploymentEquitySection user={user} />,
    },
  ];

  return (
    <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
      <TableOfContents.Navigation>
        <TableOfContents.List>
          {items.map((item) => (
            <TableOfContents.ListItem key={item.id}>
              <TableOfContents.AnchorLink id={item.id}>
                {item.title}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          ))}
        </TableOfContents.List>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        {items.map((item, index) => (
          <TableOfContents.Section key={item.id} id={item.id}>
            <TableOfContents.Heading
              icon={item.titleIcon}
              as="h3"
              {...(index > 0
                ? {
                    "data-h2-margin": "base(x3, 0, x1, 0)",
                  }
                : {
                    "data-h2-margin": "base(0, 0, x1, 0)",
                  })}
            >
              {item.title}
            </TableOfContents.Heading>
            {item.content}
          </TableOfContents.Section>
        ))}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

type RouteParams = {
  userId: Scalars["ID"];
};

const UserInformationPage = () => {
  const { userId } = useRequiredParams<RouteParams>("userId");
  const intl = useIntl();
  const [{ data: lookupData, fetching, error }] = useGetViewUserDataQuery({
    variables: { id: userId },
  });

  const user = lookupData?.user;
  const pools = lookupData?.pools.filter(notEmpty);

  return (
    <AdminContentWrapper>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Candidate details",
          id: "dj8GiH",
          description: "Page title for the individual user page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        {user && pools ? (
          <UserInformation user={user} pools={pools} />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default UserInformationPage;
