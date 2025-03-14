import { Heading, HeadingProps } from "@gc-digital-talent/ui";

const SubHeading = (props: HeadingProps) => (
  <Heading
    level="h2"
    color="primary"
    data-h2-margin-top="base(0)"
    data-h2-font-weight="base(400)"
    {...props}
  />
);

export default SubHeading;
