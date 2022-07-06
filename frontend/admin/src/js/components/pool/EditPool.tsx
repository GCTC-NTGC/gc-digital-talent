import * as React from "react";

interface EditPoolFormProps {
  testMessage: string;
}

const EditPoolForm = ({ testMessage }: EditPoolFormProps) => {
  return (
    <>
      <span>EditPoolForm</span>
      {`Message: ${testMessage}`}
    </>
  );
};

const EditPool = ({ poolId }: { poolId: string }) => {
  return <EditPoolForm testMessage={`Hello pool ${poolId}`} />;
};

export default EditPool;
