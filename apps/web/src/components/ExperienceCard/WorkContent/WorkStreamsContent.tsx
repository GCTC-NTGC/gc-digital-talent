import { useIntl } from "react-intl";

import { Maybe, WorkStream } from "@gc-digital-talent/graphql";
import { HeadingRank, Separator, Ul } from "@gc-digital-talent/ui";
import {
  groupBy,
  sortAlphaBy,
  uniqueItems,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
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
      const streams = groupedWorkStreams[id].sort(
        sortAlphaBy((workStream) => workStream?.name?.localized),
      );
      if (!community || !streams?.length) {
        return undefined;
      }

      return {
        community,
        workStreams: streams,
      };
    }),
  ).sort(sortAlphaBy((workStream) => workStream.community.name?.localized));

  return workStreamsByCommunity.length > 0 ? (
    <>
      <Separator decorative space="sm" />
      <ContentSection
        headingLevel={headingLevel}
        title={intl.formatMessage(pageTitles.workStreams)}
      >
        <Ul>
          {workStreamsByCommunity.map((item) => (
            <li key={item.community.id} data-h2-font-weight="base(bold)">
              {item.community.name?.localized ?? na}
              <Ul unStyled className="mb-3 font-normal" space="md">
                {item.workStreams.map((workStream) => (
                  <li key={workStream.id}>
                    <BoolCheckIcon value={true}>
                      {workStream.name?.localized ?? na}
                    </BoolCheckIcon>
                  </li>
                ))}
              </Ul>
            </li>
          ))}
        </Ul>
      </ContentSection>
    </>
  ) : null;
};

export default WorkStreamContent;
