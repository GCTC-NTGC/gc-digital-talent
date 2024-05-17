import { useIntl } from "react-intl";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";

import { Link } from "@gc-digital-talent/ui";

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
        className: "bg-[100%_110%] md:bg-[calc(50%+20rem)]",
      }}
    >
      <p
        className="mb-12 text-center font-light sm:max-w-1/2 sm:text-left"
        data-h2-font-size="base(h6, 1.4)"
        data-h2-color="base:all(white)"
      >
        {intl.formatMessage({
          defaultMessage:
            "Your profile is at the heart of the platform. Tell your story, show how you developed your skills, and use your profile to apply for jobs. Whether you're hunting for a job now or just thinking about the future, your profile is your path to getting found by hiring managers.",
          id: "xggOcb",
          description: "Description of how application profiles work.",
        })}
      </p>
      <div className="flex justify-center gap-6 sm:justify-start">
        <Link
          color="quinary"
          mode="cta"
          href={paths.profile()}
          icon={UserPlusIcon}
        >
          {intl.formatMessage({
            defaultMessage: "Create a profile",
            id: "7hUWc+",
            description: "Link text for users to create a profile",
          })}
        </Link>
      </div>
    </SkewedImageContainer>
  );
};

export default Profile;
