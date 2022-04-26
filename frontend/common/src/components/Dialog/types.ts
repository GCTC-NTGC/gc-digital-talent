export interface DialogProps {
  isOpen: boolean;
  onDismiss: (e: React.MouseEvent | React.KeyboardEvent) => void;
  title: string;
  subtitle?: string;
}
