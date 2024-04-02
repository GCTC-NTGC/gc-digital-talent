import React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useAuthorization } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";

import CareerTimelineAndRecruitment from "./components/CareerTimelineAndRecruitment";

const CareerTimelineExperiences_Query = graphql(/* GraphQL */ `
  query CareerTimelineExperiences($id: UUID!) {
    user(id: $id) {
      id
      experiences {
        id
        details
        user {
          id
          email
        }
        skills {
          id
          key
          name {
            en
            fr
          }
          category
          experienceSkillRecord {
            details
          }
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo
          awardedScope
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type
          status
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
        }
      }
      poolCandidates {
        id
        status
        archivedAt
        submittedAt
        suspendedAt
        pool {
          id
          closingDate
          name {
            en
            fr
          }
          publishingGroup
          stream
          classification {
            id
            group
            level
            name {
              en
              fr
            }
            genericJobTitles {
              id
              key
              name {
                en
                fr
              }
            }
            minSalary
            maxSalary
          }
          essentialSkills {
            id
            key
            name {
              en
              fr
            }
            description {
              en
              fr
            }
            category
            families {
              id
              key
              description {
                en
                fr
              }
              name {
                en
                fr
              }
            }
          }
          team {
            id
            name
            departments {
              id
              departmentNumber
              name {
                en
                fr
              }
            }
          }
        }
      }
    }
  }
`);

const CareerTimelineAndRecruitmentPage = () => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const [{ data, fetching, error }] = useQuery({
    query: CareerTimelineExperiences_Query,
    variables: { id: userAuthInfo?.id || "" },
  });

  const experiences = data?.user?.experiences?.filter(notEmpty);
  const applications = data?.user?.poolCandidates?.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user ? (
        <CareerTimelineAndRecruitment
          userId={data?.user.id}
          experiences={experiences || []}
          applications={applications || []}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default CareerTimelineAndRecruitmentPage;
