import { ReactNode } from "react";

interface SignPostProps {
  title: string;
  introduction?: ReactNode;
}

// This component is for adding information into a long form to help the user know what's coming up without using a sematic header.
const SignPost = ({ title, introduction }: SignPostProps) => {
  return (
    <div>
      <div data-h2-margin-top="base(x.5)">
        <p data-h2-font-weight="base(700)">{title}</p>
        {introduction ? (
          <p data-h2-margin-top="base(x.25)">{introduction}</p>
        ) : null}
      </div>
    </div>
  );
};

export default SignPost;
