import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import QuestionResponses from "./QuestionResponses";

const ScreeningQuestionResponsesSnapshot_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningQuestionResponsesSnapshot on PoolCandidate {
    screeningQuestionResponses {
      id
      answer
      screeningQuestion {
        id
        question {
          localized
        }
      }
    }
  }
`);

interface ScreeningQuestionResponsesSnapshotProps {
  query?: FragmentType<typeof ScreeningQuestionResponsesSnapshot_Fragment>;
}

const ScreeningQuestionResponsesSnapshot = ({
  query,
}: ScreeningQuestionResponsesSnapshotProps) => {
  const application = getFragment(
    ScreeningQuestionResponsesSnapshot_Fragment,
    query,
  );

  return (
    <QuestionResponses
      responses={unpackMaybes(application?.screeningQuestionResponses)}
    />
  );
};

export default ScreeningQuestionResponsesSnapshot;
