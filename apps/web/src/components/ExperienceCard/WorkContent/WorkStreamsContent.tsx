import { useIntl } from "react-intl";

import { Maybe, WorkStream } from "@gc-digital-talent/graphql";
import { HeadingRank, Separator } from "@gc-digital-talent/ui";
import { groupBy, uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import pageTitles from "~/messages/pageTitles";

import ContentSection from "../ContentSection";

interface WorkStreamsContentProps {
  workStreams?: Maybe<WorkStream[]>;
  headingLevel?: HeadingRank;
}

const WorkStreamContent = ({
  workStreams,
  headingLevel = "h3",
}: WorkStreamsContentProps) => {
  const intl = useIntl();
  const na = intl.formatMessage(commonMessages.notAvailable);

  if (!workStreams?.length) {
    return null;
  }

  const communities = uniqueItems(
    workStreams.flatMap((workStream) => workStream.community),
  );

  const groupedWorkStreams = groupBy(
    workStreams,
    (workStream) => workStream?.community?.id ?? "",
  );

  const workStreamsByCommunity = unpackMaybes(
    Object.keys(groupedWorkStreams).map((id) => {
      const community = communities.find((c) => c?.id === id);
      const streams = groupedWorkStreams[id].sort((a, b) =>
        (a?.name?.localized ?? "").localeCompare(b?.name?.localized ?? ""),
      );
      if (!community || !streams?.length) {
        return undefined;
      }

      return {
        community,
        workStreams: streams,
      };
    }),
  ).sort((a, b) =>
    (a?.community?.name?.localized ?? "").localeCompare(
      b?.community.name?.localized ?? "",
    ),
  );

  return workStreamsByCommunity.length > 0 ? (
    <>
      <Separator decorative space="sm" />
      <ContentSection
        headingLevel={headingLevel}
        title={intl.formatMessage(pageTitles.workStreams)}
      >
        <ul>
          {workStreamsByCommunity.map((item) => (
            <li key={item.community.id} data-h2-font-weight="base(bold)">
              {item.community.name?.localized ?? na}
              <ul
                data-h2-list-style="base(none)"
                data-h2-font-weight="base(400)"
                data-h2-margin-bottom="base(x.5)"
                data-h2-padding-left="base(0)"
              >
                {item.workStreams.map((workStream) => (
                  <li key={workStream.id}>
                    <BoolCheckIcon value={true}>
                      {workStream.name?.localized ?? na}
                    </BoolCheckIcon>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ContentSection>
    </>
  ) : null;
};

export default WorkStreamContent;
