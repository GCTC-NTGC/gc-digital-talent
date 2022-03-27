import faker from "faker";
import { WorkRegion } from "../api/generated";

const generateWorkLocation = () => ({
  locationExemptions: faker.random.word(),
  locationPreferences: [WorkRegion.Atlantic],
});

export default generateWorkLocation;
