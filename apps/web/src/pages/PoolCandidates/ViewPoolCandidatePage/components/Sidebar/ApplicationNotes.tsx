import { useMutation } from "urql";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import type { FormValues } from "~/components/SidebarNotesForm/SidebarNotesForm";
import SidebarNotesForm from "~/components/SidebarNotesForm/SidebarNotesForm";

const ApplicationNotes_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationNotes on PoolCandidate {
    id
    notes
  }
`);

const UpdateApplicationNotes_Mutation = graphql(/** GraphQL */ `
  mutation UpdateApplicationNotes($id: UUID!, $notes: String) {
    updatePoolCandidateNotes(id: $id, notes: $notes) {
      id
      notes
    }
  }
`);

interface ApplicationNotesProps {
  query: FragmentType<typeof ApplicationNotes_Fragment>;
}

const ApplicationNotes = ({ query }: ApplicationNotesProps) => {
  const application = getFragment(ApplicationNotes_Fragment, query);
  const [, updateNotes] = useMutation(UpdateApplicationNotes_Mutation);

  const handleSubmit = async (formValues: FormValues) => {
    return updateNotes({ id: application.id, notes: formValues.notes }).then(
      (res) => {
        if (!res.data || res.error) {
          throw new Error();
        }
      },
    );
  };

  return (
    <SidebarNotesForm
      values={{ notes: application.notes }}
      onSave={handleSubmit}
    />
  );
};

export default ApplicationNotes;
