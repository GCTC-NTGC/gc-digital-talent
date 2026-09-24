export interface MigrationNoticeScrollProps {
  ignoreAction: "scroll";
  scrollToIdOnIgnore: string;
  onDismiss?: never;
}

export interface MigrationNoticeDismissProps {
  ignoreAction: "dismiss";
  scrollToIdOnIgnore?: never;
  onDismiss: () => void;
}
