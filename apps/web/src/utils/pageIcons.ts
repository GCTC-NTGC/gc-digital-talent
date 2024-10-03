import BoltOutlineIcon from "@heroicons/react/24/outline/BoltIcon";
import BoltSolidIcon from "@heroicons/react/24/solid/BoltIcon";
import BuildingOffice2OutlineIcon from "@heroicons/react/24/outline/BuildingOffice2Icon";
import BuildingOffice2SolidIcon from "@heroicons/react/24/solid/BuildingOffice2Icon";
import CloudOutlineIcon from "@heroicons/react/24/outline/CloudIcon";
import CloudSolidIcon from "@heroicons/react/24/solid/CloudIcon";
import HomeOutlineIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeSolidIcon from "@heroicons/react/24/solid/HomeIcon";
import IdentificationOutlineIcon from "@heroicons/react/24/outline/IdentificationIcon";
import IdentificationSolidIcon from "@heroicons/react/24/solid/IdentificationIcon";
import LightBulbOutlineIcon from "@heroicons/react/24/outline/LightBulbIcon";
import LightBulbSolidIcon from "@heroicons/react/24/solid/LightBulbIcon";
import MegaphoneOutlineIcon from "@heroicons/react/24/outline/MegaphoneIcon";
import MegaphoneSolidIcon from "@heroicons/react/24/solid/MegaphoneIcon";
import PaperAirplaneOutlineIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import PaperAirplaneSolidIcon from "@heroicons/react/24/solid/PaperAirplaneIcon";
import SquaresPlusOutlineIcon from "@heroicons/react/24/outline/SquaresPlusIcon";
import SquaresPlusSolidIcon from "@heroicons/react/24/solid/SquaresPlusIcon";
import TagOutlineIcon from "@heroicons/react/24/outline/TagIcon";
import TagSolidIcon from "@heroicons/react/24/solid/TagIcon";
import UsersOutlineIcon from "@heroicons/react/24/outline/UsersIcon";
import UsersSolidIcon from "@heroicons/react/24/solid/UsersIcon";
import UserCircleOutlineIcon from "@heroicons/react/24/outline/UserCircleIcon";
import UserCircleSolidIcon from "@heroicons/react/24/solid/UserCircleIcon";

import { IconType } from "@gc-digital-talent/ui";

interface PageIcon {
  solid: IconType;
  outline: IconType;
}

const pageIcons: Record<string, PageIcon> = {
  announcements: {
    solid: MegaphoneSolidIcon,
    outline: MegaphoneOutlineIcon,
  },
  classifications: {
    solid: TagSolidIcon,
    outline: TagOutlineIcon,
  },
  communities: {
    solid: UsersSolidIcon,
    outline: UsersOutlineIcon,
  },
  dashboard: {
    solid: HomeSolidIcon,
    outline: HomeOutlineIcon,
  },
  departments: {
    solid: BuildingOffice2SolidIcon,
    outline: BuildingOffice2OutlineIcon,
  },
  poolCandidates: {
    solid: IdentificationSolidIcon,
    outline: IdentificationOutlineIcon,
  },
  processes: {
    solid: SquaresPlusSolidIcon,
    outline: SquaresPlusOutlineIcon,
  },
  skillsEditor: {
    solid: LightBulbSolidIcon,
    outline: LightBulbOutlineIcon,
  },
  skillsList: {
    solid: BoltSolidIcon,
    outline: BoltOutlineIcon,
  },
  skillFamilies: {
    solid: CloudSolidIcon,
    outline: CloudOutlineIcon,
  },
  talentRequests: {
    solid: PaperAirplaneSolidIcon,
    outline: PaperAirplaneOutlineIcon,
  },
  teams: {
    solid: UsersSolidIcon,
    outline: UsersOutlineIcon,
  },
  users: {
    solid: UserCircleSolidIcon,
    outline: UserCircleOutlineIcon,
  },
};

export default pageIcons;
