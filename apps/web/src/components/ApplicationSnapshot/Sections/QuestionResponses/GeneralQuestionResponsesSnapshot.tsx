import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import QuestionResponses from "./QuestionResponses";

const GeneralQuestionResponsesSnapshot_Fragment = graphql(/** GraphQL */ `
  fragment GeneralQuestionResponsesSnapshot on PoolCandidate {
    generalQuestionResponses {
      id
      answer
      generalQuestion {
        id
        question {
          localized
        }
      }
    }
  }
`);

interface GeneralQuestionResponsesSnapshotProps {
  query?: FragmentType<typeof GeneralQuestionResponsesSnapshot_Fragment>;
}

const GeneralQuestionResponsesSnapshot = ({
  query,
}: GeneralQuestionResponsesSnapshotProps) => {
  const application = getFragment(
    GeneralQuestionResponsesSnapshot_Fragment,
    query,
  );

  return (
    <QuestionResponses
      responses={unpackMaybes(application?.generalQuestionResponses)}
    />
  );
};

export default GeneralQuestionResponsesSnapshot;
