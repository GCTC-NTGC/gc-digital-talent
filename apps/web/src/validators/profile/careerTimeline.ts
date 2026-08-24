interface Experience {
  id: string;
}

type Experiences = Experience[] | undefined | null;

export function isIncomplete(experiences: Experiences): boolean {
  return !experiences?.length;
}
