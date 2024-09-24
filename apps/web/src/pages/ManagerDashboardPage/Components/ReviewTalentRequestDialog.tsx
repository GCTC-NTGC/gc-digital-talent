import { Dialog } from "@gc-digital-talent/ui";

interface ReviewTalentRequestDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

const ReviewTalentRequestDialog = ({
  open,
  setOpen,
  id,
}: ReviewTalentRequestDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content>
        <Dialog.Header>Header</Dialog.Header>
        <Dialog.Body>{id}</Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReviewTalentRequestDialog;
