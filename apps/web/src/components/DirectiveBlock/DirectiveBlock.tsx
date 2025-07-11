import { useIntl } from "react-intl";
import MagnifyingGlassCircleIcon from "@heroicons/react/24/outline/MagnifyingGlassCircleIcon";

import { Heading, Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

const DirectiveBlock = () => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <>
      <Heading
        icon={MagnifyingGlassCircleIcon}
        color="error"
        size="h3"
        className="mt-30 font-normal"
      >
        {intl.formatMessage({
          defaultMessage: "Directive on Digital Talent",
          id: "xXwUGs",
          description: "Title for the digital talent directive page",
        })}
      </Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "GC Digital Talent offers a handful of helpful resources to make completing your responsibilities under the Directive on Digital Talent as easy as possible. This includes an online form, implementation guidance, and links to the Directive.",
          id: "fXl3Cm",
          description: "Summary of the directive on digital talent",
        })}
      </p>
      <Link href={paths.directive()} color="error" mode="solid">
        {intl.formatMessage({
          defaultMessage: "Learn more<hidden> about the directive</hidden>",
          id: "+cqG9n",
          description: "Link text to the directive on digital talent page",
        })}
      </Link>
    </>
  );
};

export default DirectiveBlock;
