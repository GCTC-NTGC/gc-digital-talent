import { toast } from "react-toastify";

export default function getProfileCompleteToast({
  preProfileStatus,
  currentProfileStatus,
  message,
}: {
  preProfileStatus: boolean | null | undefined;
  currentProfileStatus: boolean | null | undefined;
  message: string;
}): React.ReactNode {
  if (!preProfileStatus && currentProfileStatus) {
    return toast.success(message);
  }
  return null;
}
