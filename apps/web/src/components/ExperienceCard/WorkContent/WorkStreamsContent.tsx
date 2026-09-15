import { useIntl } from "react-intl";

import type { LocalizedString } from "@gc-digital-talent/graphql";
import type { HeadingRank } from "@gc-digital-talent/ui";
import { Separator, Ul } from "@gc-digital-talent/ui";
import {
  groupBy,
  sortAlphaBy,
  uniqueItems,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import pageTitles from "~/messages/pageTitles";

import ContentSection from "../ContentSection";

interface WorkStreamCommunity {
  id: string;
  name?: LocalizedString | null;
}

export interface ExperienceWorkStream {
  id: string;
  name?: LocalizedString | null;
  community?: WorkStreamCommunity | null;
}

interface WorkStreamsContentProps {
  workStreams?: ExperienceWorkStream[] | null;
  headingLevel?: HeadingRank;
}

const WorkStreamContent = ({
  workStreams,
  headingLevel = "h3",
}: WorkStreamsContentProps) => {
  const intl = useIntl();

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
        sortAlphaBy((workStream) => getLocalizedName(workStream?.name, intl)),
      );
      if (!community || !streams?.length) {
        return undefined;
      }

      return {
        community,
        workStreams: streams,
      };
    }),
  ).sort(
    sortAlphaBy((workStream) =>
      getLocalizedName(workStream.community.name, intl),
    ),
  );

  return workStreamsByCommunity.length > 0 ? (
    <>
      <Separator decorative space="sm" />
      <ContentSection
        headingLevel={headingLevel}
        title={intl.formatMessage(pageTitles.workStreams)}
      >
        <Ul>
          {workStreamsByCommunity.map((item) => (
            <li key={item.community.id} className="font-bold">
              {getLocalizedName(item.community.name, intl)}
              <Ul unStyled className="mb-3 list-none! font-normal" space="md">
                {item.workStreams.map((workStream) => (
                  <li key={workStream.id}>
                    <BoolCheckIcon value={true}>
                      {getLocalizedName(workStream.name, intl)}
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
