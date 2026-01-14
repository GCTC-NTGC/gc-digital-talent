import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { ReactNode, Fragment } from "react";

import {
  Button,
  Card,
  Link,
  Separator,
  UNICODE_CHAR,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  SearchResultCard_PoolFragment as SearchResultCardPoolFragmentType,
  graphql,
  PoolSkillType,
} from "@gc-digital-talent/graphql";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";
import { filterPoolSkillsByType } from "~/utils/skillUtils";

const testId = (text: ReactNode) => (
  <span data-testid="candidateCount">{text}</span>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchResultCard_PoolFragment = graphql(/* GraphQL */ `
  fragment SearchResultCard_Pool on Pool {
    id
    workStream {
      id
      name {
        en
        fr
      }
    }
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    classification {
      group
      level
    }
    name {
      en
      fr
    }
    community {
      name {
        localized
      }
    }
    poolSkills(type: ESSENTIAL) {
      id
      type {
        value
        label {
          en
          fr
        }
      }
      skill {
        id
        name {
          en
          fr
        }
        description {
          en
          fr
        }
        category {
          value
          label {
            en
            fr
          }
        }
        key
      }
    }
  }
`);

interface SearchResultCardProps {
  candidateCount: number;
  pool: SearchResultCardPoolFragmentType;
}

const SearchResultCard = ({ candidateCount, pool }: SearchResultCardProps) => {
  const intl = useIntl();
  const { register, setValue } = useFormContext();
  const poolSubmitProps = register("pool");
  const paths = useRoutes();
  const essentialSkills = filterPoolSkillsByType(
    pool.poolSkills,
    PoolSkillType.Essential,
  );

  return (
    <Card
      as="article"
      className="rounded-l-none border-l-12 border-l-primary"
      aria-labelledby={`search_pool_${pool.id}`}
    >
      <p className="text-lg font-bold lg:text-xl" id={`search_pool_${pool.id}`}>
        {getShortPoolTitleHtml(intl, {
          workStream: pool.workStream,
          name: pool.name,
          publishingGroup: pool.publishingGroup,
          classification: pool.classification,
        })}
      </p>
      <p className="mt-3 mb-6 flex gap-x-3">
        <span>
          {intl.formatMessage(
            {
              defaultMessage:
                "Process run by the {team} for the {workStream} work stream",
              id: "ZL7sNi",
              description: "Team and work stream of pool",
            },
            {
              team: pool?.community
                ? pool.community?.name?.localized
                : intl.formatMessage({
                    defaultMessage: "Digital Community Management Team",
                    id: "S82O61",
                    description: "Default team for pool",
                  }),
              workStream: pool?.workStream
                ? getLocalizedName(pool.workStream.name, intl)
                : intl.formatMessage(commonMessages.notAvailable),
            },
          )}
        </span>
        <span aria-hidden>{UNICODE_CHAR.BULLET}</span>
        <span className="font-bold text-primary-600 dark:text-primary-200">
          {intl.formatMessage(
            {
              defaultMessage: `{candidateCount, plural,
                one {<testId>#</testId> approximate match}
                other {<testId>#</testId> approximate matches}
              }`,
              id: "IMGvOV",
              description:
                "Message for total estimated matching candidates in pool",
            },
            {
              testId,
              candidateCount,
            },
          )}
        </span>
      </p>
      <p className="mt-6 mb-1.5">
        {intl.formatMessage({
          defaultMessage:
            "These essential skills were assessed during the process:",
          id: "VN6uCI",
          description:
            "Text showing the essentials skills assessed during the process",
        })}
      </p>
      <p className="flex flex-wrap gap-x-3 text-sm">
        {essentialSkills.length > 0
          ? essentialSkills.map((skill, index) => (
              <Fragment key={skill.id}>
                {index !== 0 && <span aria-hidden>{UNICODE_CHAR.BULLET}</span>}
                <span
                  key={skill.id}
                  className="text-gray-600 dark:text-gray-200"
                >
                  {getLocalizedName(skill?.name, intl)}
                </span>
              </Fragment>
            ))
          : null}
      </p>
      <Separator space="sm" />
      <div className="mt-6 flex items-center gap-6">
        <Button
          color="primary"
          type="submit"
          mode="inline"
          {...poolSubmitProps}
          value={pool.id}
          onClick={() => {
            setValue("pool", pool.id);
            setValue("count", candidateCount);
          }}
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "Request candidates<hidden> from {poolName}</hidden>",
              id: "MiqbcI",
              description:
                "Button link message on search page that takes user to the request form.",
            },
            { poolName: getLocalizedName(pool.name, intl) },
          )}
        </Button>
        <Link
          mode="inline"
          color="primary"
          href={paths.jobPoster(pool.id || "")}
          newTab
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "View job advertisement<hidden> for {processTitle}</hidden>",
              id: "WxviCX",
              description:
                "Link message that shows the job poster for the recruitment process.",
            },
            {
              processTitle: getLocalizedName(pool.name, intl),
            },
          )}
        </Link>
      </div>
    </Card>
  );
};

export default SearchResultCard;
