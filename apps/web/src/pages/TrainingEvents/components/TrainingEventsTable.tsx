interface ClassificationTableProps {
  // classificationsQuery: FragmentType<typeof ClassificationTableRow_Fragment>[];
  title: string;
}

export const TrainingEventsTable = ({
  // classificationsQuery,
  title,
}: ClassificationTableProps) => {
  return <>{title}</>;
};

const TrainingEventsTableApi = ({ title }: { title: string }) => {
  // const [{ data, fetching, error }] = useQuery({
  //   query: ClassificationTable_Query,
  //   context,
  // });

  return (
    // <Pending fetching={fetching} error={error}>
    <TrainingEventsTable
      // classificationsQuery={unpackMaybes(data?.classifications)}
      title={title}
    />
    // </Pending>
  );
};

export default TrainingEventsTableApi;
