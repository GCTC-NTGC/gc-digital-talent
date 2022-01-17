/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "./testUtils";
import SkillChecklist from "../components/skills/SkillChecklist";
import { SkillCategory } from "../api/generated";

const testData = [
  {
    category: SkillCategory.Technical,
    description: {
      en: "Perspiciatis nulla nihil fuga facilis eum iusto ullam saepe. Sapiente enim eum. Autem vel non deleniti similique reprehenderit. Quo quasi laboriosam dicta est voluptatem consequatur fugiat a omnis. Accusamus accusamus reiciendis rem.",
      fr: "Praesentium occaecati dolor soluta sed quisquam rerum culpa qui. Rerum possimus occaecati odit esse rem voluptatem. Est id blanditiis numquam. Dolores sit quia et voluptatem laborum modi. Iure earum ut soluta qui ea laborum.",
    },
    id: "6eb10faa-a235-42c5-9559-07aff1a3a2fa",
    key: "Montenegro",
    name: {
      en: "Montenegro",
      fr: "Montenegro",
    },
    skills: [null, null, null],
  },
  {
    category: SkillCategory.Behavioural,
    description: {
      en: "Nesciunt laboriosam aut cum expedita ipsam eos. Adipisci hic consequatur distinctio qui perferendis aspernatur fuga quo. Explicabo aut reiciendis debitis totam molestias reiciendis illo.",
      fr: "Quod sit eaque odio veniam reiciendis. Ea exercitationem deleniti. Est voluptatem aut. Sint veritatis numquam eligendi error similique. Ut molestias cupiditate sint explicabo et in vitae non.",
    },
    id: "450ad2ab-d442-4698-82d5-02a94bb4f63c",
    key: "Inverse",
    name: {
      en: "Inverse",
      fr: "Inverse",
    },
    skills: [null, null],
  },
  {
    category: SkillCategory.Technical,
    description: {
      en: "Necessitatibus tenetur soluta ducimus. Nulla reiciendis cumque fugit ullam voluptas. Velit qui cum aut magnam culpa enim aut delectus. Officia est distinctio et provident a incidunt facilis. Nihil dolorum id voluptatum sit rem.",
      fr: "Distinctio quis nostrum eum et placeat molestiae debitis. Aut ullam explicabo similique. Deserunt omnis in aperiam et.",
    },
    id: "fa563e25-16fe-44c8-b711-e5b7fd2ed028",
    key: "engage",
    name: {
      en: "engage",
      fr: "engage",
    },
    skills: [null, null, null, null],
  },
  {
    category: SkillCategory.Technical,
    description: {
      en: "Velit similique eos voluptate aperiam quasi voluptatibus optio quis. Quam quisquam ab et consequatur aut. Vero incidunt aut. Ea rerum qui placeat ipsum laboriosam occaecati corrupti illo. Velit dolor sit ipsum autem. Modi officiis nisi rerum non est.",
      fr: "Doloremque repellendus dolorem et dolorum ab in. Labore asperiores recusandae ut laborum soluta sed et. Placeat qui delectus enim iste in non. Modi amet eius rerum. Quod qui quos ut tempora soluta aliquam.",
    },
    id: "100674eb-f692-480d-9ba7-7a89ebf737ae",
    key: "Computer",
    name: {
      en: "Computer",
      fr: "Computer",
    },
    skills: [null, null, null],
  },
  {
    category: SkillCategory.Behavioural,
    description: {
      en: "Et eum facilis officia quia. Occaecati et alias officiis enim ad nihil quibusdam rerum. Soluta tenetur blanditiis est. Numquam temporibus rerum incidunt qui aut. Ipsam numquam a occaecati rem. Quo quia sequi.",
      fr: "Autem facilis laudantium numquam minima amet officia consequatur. Placeat sed cum sint ad magni quia porro nihil. Laudantium error voluptas sit quia ratione. Corrupti consequuntur ex quisquam.",
    },
    id: "f0cbb1e3-1b8b-490f-b443-a1108e0adcf4",
    key: "Steel",
    name: {
      en: "Steel",
      fr: "Steel",
    },
    skills: [null],
  },
];
const callback = jest.fn();

const renderSkillChecklist = () => {
  return render(
    <SkillChecklist skillFamilies={testData} callback={callback} />,
  );
};

describe("Skill Checklist Tests", () => {
  test("should display the skill checklist div", async () => {
    renderSkillChecklist();
    const element = screen.getByTestId("skillChecklist");
    expect(element).toBeTruthy();
  });

  test("get correct response after checking one box", async () => {
    renderSkillChecklist();
    fireEvent.click(
      screen.getByLabelText(
        `${testData[1].key} (${testData[1].skills.length})`,
      ),
    );
    expect(callback).toBeCalledWith([testData[1]]);
  });

  test("get correct response after checking all boxes", async () => {
    renderSkillChecklist();
    fireEvent.click(
      screen.getByLabelText(
        `${testData[1].key} (${testData[1].skills.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[2].key} (${testData[2].skills.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[0].key} (${testData[0].skills.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[4].key} (${testData[4].skills.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[3].key} (${testData[3].skills.length})`,
      ),
    );
    expect(callback).toHaveBeenLastCalledWith([
      testData[1],
      testData[2],
      testData[0],
      testData[4],
      testData[3],
    ]);
  });

  test("get correct response after checking and unchecking boxes", async () => {
    renderSkillChecklist();
    fireEvent.click(
      screen.getByLabelText(
        `${testData[3].key} (${testData[3].skills.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[1].key} (${testData[1].skills.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[3].key} (${testData[3].skills.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[4].key} (${testData[4].skills.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[1].key} (${testData[1].skills.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[3].key} (${testData[3].skills.length})`,
      ),
    );
    expect(callback).toHaveBeenLastCalledWith([testData[4], testData[3]]);
  });
});
