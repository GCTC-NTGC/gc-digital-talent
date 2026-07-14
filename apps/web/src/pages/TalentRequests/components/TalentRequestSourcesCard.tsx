import { useIntl } from "react-intl";
import FolderOpenIcon from "@heroicons/react/24/outline/FolderOpenIcon";

import {
  getFragment,
  graphql,
  TalentRequestSource,
  type FragmentType,
  type LocalizedEnumString,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

import TalentRequestSectionCard from "./TalentRequestSectionCard";

const TalentRequestSourcesCard_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestSourcesCard on TalentRequest {
    applicantFilter {
      qualifiedInClassifications {
        id
        groupAndLevel
      }
      qualifiedInWorkStreams {
        id
        name {
          localized
        }
      }
      pools {
        id
        displayName {
          display {
            localized
          }
        }
      }
      community {
        name {
          localized
        }
      }
      talentSources {
        value
      }
    }
  }
`);

interface TalentRequestSourcesCardProps {
  query: FragmentType<typeof TalentRequestSourcesCard_Fragment>;
  talentSourceOptions: LocalizedEnumString[];
}

const TalentRequestSourcesCard = ({
  query,
  talentSourceOptions,
}: TalentRequestSourcesCardProps) => {
  const intl = useIntl();
  const { applicantFilter } = getFragment(
    TalentRequestSourcesCard_Fragment,
    query,
  );
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const classifications = unpackMaybes(
    applicantFilter?.qualifiedInClassifications,
  );
  const pools = unpackMaybes(applicantFilter?.pools);
  const workStreams = unpackMaybes(applicantFilter?.qualifiedInWorkStreams);

  // ADVANCEMENT is not yet implemented for matching, so it isn't offered as a search option
  const talentSourceOptionsFiltered = talentSourceOptions.filter(
    (source) => source.value !== (TalentRequestSource.Advancement as string),
  );
  const selectedTalentSources = unpackMaybes(
    applicantFilter?.talentSources?.map((source) => source?.value),
  );

  return (
    <TalentRequestSectionCard
      title={intl.formatMessage(talentRequestMessages.sourceOfTalent)}
      subtitle={intl.formatMessage({
        defaultMessage: "This is where your candidates come from.",
        id: "RBSXa2",
        description: "Description of the talent request users sources",
      })}
      icon={FolderOpenIcon}
      color="secondary"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Target classification(s)",
            id: "+vI/WA",
            description: "Label for a talent requests classification criteria",
          })}
        >
          {classifications.length > 0 ? (
            <Ul>
              {classifications.map(({ id, groupAndLevel }) => (
                <li key={id}>{groupAndLevel}</li>
              ))}
            </Ul>
          ) : (
            notProvided
          )}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.talentSource)}
        >
          <Ul unStyled noIndent inside>
            {talentSourceOptionsFiltered.map((source) => (
              <li key={source.value}>
                <BoolCheckIcon
                  value={selectedTalentSources.includes(
                    source.value as TalentRequestSource,
                  )}
                  trueLabel={intl.formatMessage(commonMessages.selected)}
                  falseLabel={intl.formatMessage(commonMessages.notSelected)}
                >
                  {source.value ===
                    (TalentRequestSource.QualifiedInPool as string) &&
                    intl.formatMessage(
                      talentRequestMessages.qualifiedInPoolLabel,
                    )}
                  {source.value === (TalentRequestSource.AtLevel as string) &&
                    intl.formatMessage(talentRequestMessages.atLevelLabel)}
                </BoolCheckIcon>
              </li>
            ))}
          </Ul>
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Target work stream(s)",
            id: "QFk8ZF",
            description: "Label for a talent requests work stream criteria",
          })}
        >
          {workStreams.length > 0 ? (
            <Ul>
              {workStreams.map(({ id, name }) => (
                <li key={id}>{name?.localized ?? notProvided}</li>
              ))}
            </Ul>
          ) : (
            notProvided
          )}
        </FieldDisplay>
      </div>
      <TalentRequestSectionCard.Separator />
      <FieldDisplay
        label={intl.formatMessage(talentRequestMessages.community)}
        className="mb-6"
      >
        {applicantFilter?.community?.name?.localized ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage({
          defaultMessage: "Requested pool(s)",
          id: "Fl1K8W",
          description: "Label for the pools being sourced for a talent request",
        })}
      >
        {pools.length > 0 ? (
          <Ul>
            {pools.map(({ id, displayName }) => (
              <li key={id}>{displayName?.display.localized ?? notProvided}</li>
            ))}
          </Ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
    </TalentRequestSectionCard>
  );
};

export default TalentRequestSourcesCard;
