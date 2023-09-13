import React from "react";

export type SignPostProps = {
  title: string;
  introduction: string;
};

const SignPost = ({ title, introduction }: SignPostProps) => {
  return (
    <div>
      <div data-h2-margin-top="base(x.5)">
        <p data-h2-font-weight="base(700)">{title}</p>
        <p data-h2-margin-top="base(x.25)">{introduction}</p>
      </div>
    </div>
  );
};

export default SignPost;
