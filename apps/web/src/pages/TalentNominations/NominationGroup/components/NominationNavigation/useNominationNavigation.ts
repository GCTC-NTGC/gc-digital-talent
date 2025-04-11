import { useLocation } from "react-router";

interface NominationLocation {
  state?: {
    nominationIds?: string[];
  };
}

type UseNominationNavigationReturn = {
  nominationIds?: string[];
  previousNomination?: string;
  nextNomination?: string;
  lastNomination?: boolean;
} | null;

const useNominationNavigation = (
  nominationId: string,
): UseNominationNavigationReturn => {
  const { state } = useLocation() as NominationLocation;
  if (!state?.nominationIds || !nominationId) return null;
  const { nominationIds } = state;

  const currentIndex = nominationIds.findIndex((id) => id === nominationId);
  if (currentIndex < 0) return null;

  const nextNomination = nominationIds[currentIndex + 1];
  const previousNomination = nominationIds[currentIndex - 1];

  if (currentIndex === 0) {
    return { nextNomination, nominationIds };
  }

  if (currentIndex === nominationIds.length - 1) {
    return {
      previousNomination,
      nominationIds,
      lastNomination: true,
    };
  }

  return { previousNomination, nextNomination, nominationIds };
};

export default useNominationNavigation;
