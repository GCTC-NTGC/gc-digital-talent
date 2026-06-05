import { useMutation } from "urql";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import type { FormValues } from "~/components/SidebarNotesForm/SidebarNotesForm";
import SidebarNotesForm from "~/components/SidebarNotesForm/SidebarNotesForm";

const TalentRequestNotes_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestNotes on TalentRequest {
    id
    adminNotes
  }
`);

const UpdateTalentRequestNotes_Mutation = graphql(/** GraphQL */ `
  mutation UpdateTalentRequestNotes(
    $id: ID!
    $input: UpdateTalentRequestInput!
  ) {
    updateTalentRequest(id: $id, talentRequest: $input) {
      id
      adminNotes
    }
  }
`);

interface TalentRequestNotesProps {
  query: FragmentType<typeof TalentRequestNotes_Fragment>;
}

const TalentRequestNotes = ({ query }: TalentRequestNotesProps) => {
  const talentRequest = getFragment(TalentRequestNotes_Fragment, query);
  const [, updateNotes] = useMutation(UpdateTalentRequestNotes_Mutation);

  const handleSubmit = async (formValues: FormValues) => {
    return updateNotes({
      id: talentRequest.id,
      input: { adminNotes: formValues.notes },
    }).then((res) => {
      if (!res.data || res.error) {
        throw new Error();
      }
    });
  };

  return (
    <SidebarNotesForm
      values={{ notes: talentRequest.adminNotes }}
      onSave={handleSubmit}
    />
  );
};

export default TalentRequestNotes;
