import { useLocation } from "react-router-dom";

type CandidateLocation = {
  state?: {
    candidateIds?: string[];
  };
};

type UsePoolCandidateNavigationReturn = {
  candidateIds?: string[];
  previousCandidate?: string;
  nextCandidate?: string;
  lastCandidate?: boolean;
} | null;

const usePoolCandidateNavigation = (
  candidateId: string,
): UsePoolCandidateNavigationReturn => {
  const { state }: CandidateLocation = useLocation();
  if (!state?.candidateIds || !candidateId) return null;
  const { candidateIds } = state;

  const currentIndex = candidateIds.findIndex((id) => id === candidateId);
  if (currentIndex < 0) return null;

  const nextCandidate = candidateIds[currentIndex + 1];
  const previousCandidate = candidateIds[currentIndex - 1];

  if (currentIndex === 0) {
    return { nextCandidate, candidateIds };
  }

  if (currentIndex === candidateIds.length - 1) {
    return {
      previousCandidate,
      candidateIds,
      lastCandidate: true,
    };
  }

  return { previousCandidate, nextCandidate, candidateIds };
};

export default usePoolCandidateNavigation;
