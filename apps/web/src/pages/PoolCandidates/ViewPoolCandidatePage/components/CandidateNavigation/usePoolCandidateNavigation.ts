import { useLocation } from "react-router";

interface CandidateLocation {
  state?: {
    candidateIds?: string[];
    stepName?: string;
  };
}

type UsePoolCandidateNavigationReturn = {
  candidateIds?: string[];
  stepName?: string;
  previousCandidate?: string;
  nextCandidate?: string;
  lastCandidate?: boolean;
} | null;

const usePoolCandidateNavigation = (
  candidateId: string,
): UsePoolCandidateNavigationReturn => {
  const { state } = useLocation() as CandidateLocation;
  if (!state?.candidateIds || !candidateId) return null;
  const { candidateIds, stepName } = state;

  const currentIndex = candidateIds.findIndex((id) => id === candidateId);
  if (currentIndex < 0) return null;

  const nextCandidate = candidateIds[currentIndex + 1];
  const previousCandidate = candidateIds[currentIndex - 1];

  if (currentIndex === 0) {
    return { nextCandidate, candidateIds, stepName };
  }

  if (currentIndex === candidateIds.length - 1) {
    return {
      previousCandidate,
      candidateIds,
      lastCandidate: true,
      stepName,
    };
  }

  return { previousCandidate, nextCandidate, candidateIds, stepName };
};

export default usePoolCandidateNavigation;
