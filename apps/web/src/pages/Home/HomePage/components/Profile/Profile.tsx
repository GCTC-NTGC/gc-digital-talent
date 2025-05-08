import { useIntl } from "react-intl";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";

import { Link } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import SkewedImageContainer from "~/components/SkewedContainer/SkewedImageContainer";
import profileHeroImg from "~/assets/img/hero-profile.webp";

const Profile = () => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <SkewedImageContainer
      imgSrc={profileHeroImg}
      imgProps={{
        "data-h2-background-position":
          "base(100% 110%) l-tablet(calc(50% + 20rem) 50%)",
      }}
    >
      <p
        data-h2-font-size="base(h6, 1.4)"
        data-h2-font-weight="base(300)"
        data-h2-color="base:all(white)"
        data-h2-margin="base(0, 0, x2, 0)"
        data-h2-max-width="base(100%) laptop(50%)"
        data-h2-text-align="base(center) p-tablet(left)"
      >
        {intl.formatMessage({
          defaultMessage:
            "Your profile is at the heart of the platform. Tell your story, show how you developed your skills, and use your profile to apply for jobs. Whether you're hunting for a job now or just thinking about the future, your profile is your path to getting found by hiring managers.",
          id: "xggOcb",
          description: "Description of how application profiles work.",
        })}
      </p>
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x1)"
        data-h2-justify-content="base(center) p-tablet(flex-start)"
      >
        <Link
          color="quinary"
          mode="cta"
          href={paths.profile()}
          icon={UserPlusIcon}
        >
          {intl.formatMessage(navigationMessages.createProfile)}
        </Link>
      </div>
    </SkewedImageContainer>
  );
};

export default Profile;
