import { useIntl } from "react-intl";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";

import { CTALink } from "@gc-digital-talent/ui";
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
      imgProps={{ className: "bg-right" }}
    >
      <p className="mb-12 text-lg text-white xs:max-w-1/2 lg:text-xl">
        {intl.formatMessage({
          defaultMessage:
            "Your profile is at the heart of the platform. Tell your story, show how you developed your skills, and use your profile to apply for jobs. Whether you're hunting for a job now or just thinking about the future, your profile is your path to getting found by hiring managers.",
          id: "xggOcb",
          description: "Description of how application profiles work.",
        })}
      </p>
      <CTALink color="success" href={paths.profile()} icon={UserPlusIcon}>
        {intl.formatMessage(navigationMessages.createProfile)}
      </CTALink>
    </SkewedImageContainer>
  );
};

export default Profile;
