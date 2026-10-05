// can specify an ID to scroll to when clicking ignore
interface MigrationNoticeScrollIgnoreProps {
  scrollToIdOnIgnore: string;
  onDismiss?: never;
}

// can specify an event to fire  when clicking ignore
interface MigrationNoticeDismissIgnoreProps {
  scrollToIdOnIgnore?: never;
  onDismiss: () => void;
}

// can't ignore
interface MigrationNoticeNoIgnoreProps {
  scrollToIdOnIgnore?: never;
  onDismiss?: never;
}

export type MigrationNoticeProps =
  | MigrationNoticeScrollIgnoreProps
  | MigrationNoticeDismissIgnoreProps
  | MigrationNoticeNoIgnoreProps;
