export interface ExperienceItemProps<E> {
  experienceQuery: E;
  index: number;
  listLength: number;
  editPath?: string;
  showEdit?: boolean;
}
