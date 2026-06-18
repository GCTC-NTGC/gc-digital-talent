import { PlacementType } from "@gc-digital-talent/graphql";

export const hasPlacedStartDate = (type?: PlacementType) => {
  return (
    type !== PlacementType.NotPlaced &&
    type !== PlacementType.UnderConsideration &&
    type !== PlacementType.PlacedTentative
  );
};
