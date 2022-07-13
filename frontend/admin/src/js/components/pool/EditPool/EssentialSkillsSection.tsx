import * as React from "react";
import { useMemo, useState } from "react";
import TableOfContents from "@common/components/TableOfContents";
import {
  Maybe,
  PoolAdvertisement,
  Skill,
  SkillCategory,
  SkillFamily,
} from "@common/api/generated";
import { useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { Button } from "@common/components";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@common/components/Tabs";
import SkillFamilyPicker from "@common/components/skills/SkillFamilyPicker/SkillFamilyPicker";
import { invertSkillSkillFamilyTree } from "@common/helpers/skillUtils";
import { SkillResults } from "@common/components/skills/SkillResults/SkillResults";
import Pagination, { usePaginationVars } from "@common/components/Pagination";
import Chip, { Chips } from "@common/components/Chip";
import { getLocalizedName } from "@common/helpers/localize";
import { SectionMetadata } from "./EditPool";

const paginationPageSize = 5;

interface EssentialSkillsSectionProps {
  poolAdvertisement: PoolAdvertisement;
  skills: Array<Skill>;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: unknown) => void;
}

export const EssentialSkillsSection = ({
  poolAdvertisement,
  skills,
  sectionMetadata,
  onSave,
}: EssentialSkillsSectionProps): JSX.Element => {
  const intl = useIntl();

  const [selectedTechnicalSkillFamilyId, setSelectedTechnicalSkillFamilyId] =
    useState<SkillFamily["id"]>();

  const [selectedTechnicalSkills, setSelectedTechnicalSkills] = useState<
    Array<Skill>
  >(poolAdvertisement.essentialSkills ? poolAdvertisement.essentialSkills : []);

  // this function can be a bit heavy
  const allSkillFamilies = useMemo(
    () => invertSkillSkillFamilyTree(skills),
    [skills],
  );

  const technicalSkillFamilyFilteredSkills = selectedTechnicalSkillFamilyId
    ? // we have a skill family Id to check
      skills.filter((skill) =>
        skill?.families?.some(
          (family) => family.id === selectedTechnicalSkillFamilyId,
        ),
      )
    : // no skill family id to check -> match any technical skill family
      skills.filter((skill) =>
        skill?.families?.some(
          (family) => family.category === SkillCategory.Technical,
        ),
      );

  const technicalSkillsFamilySkillsPagination = usePaginationVars<Skill>(
    paginationPageSize,
    technicalSkillFamilyFilteredSkills,
  );

  const handleAddSkill = (id: Skill["id"]) => {
    const skillToAdd = skills.find((skill) => skill.id === id);
    if (skillToAdd) {
      setSelectedTechnicalSkills([...selectedTechnicalSkills, skillToAdd]);
    }
  };

  const handleRemoveSkill = (id: Skill["id"]) => {
    setSelectedTechnicalSkills(
      selectedTechnicalSkills.filter((skill) => skill.id !== id),
    );
  };

  const tabs = [
    intl.formatMessage({
      defaultMessage: "Occupational skills",
      description: "Tab name for a list of occupational skills",
    }),
    intl.formatMessage({
      defaultMessage: "Transferable skills",
      description: "Tab name for a list of transferable skills",
    }),
    intl.formatMessage({
      defaultMessage: "By keyword",
      description: "Tab name for a box to search for skills",
    }),
  ];

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading>
        <h2 data-h2-margin="b(top, l)" data-h2-font-size="b(p)">
          {sectionMetadata.title}
        </h2>
      </TableOfContents.Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Select the skills that you are looking for in applicants. Any skill selected here will be required for any applicant to apply. To increase the diversity of applications try to keep the selected number of skills to a minimum.",
          description:
            "Helper message for filling in the pool essential skills",
        })}
      </p>
      <Tabs>
        <TabList>
          {tabs.map((tab, index) => (
            <Tab key={tab} index={index}>
              {tab}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <SkillFamilyPicker
              title={intl.formatMessage({
                defaultMessage: "Skill groups",
                description: "A title for a list of skill families",
              })}
              nullSelectionLabel={intl.formatMessage({
                defaultMessage: "All technical skills",
                description:
                  "The option label for 'no filter' on the list of occupational skills",
              })}
              skillFamilies={allSkillFamilies.filter(
                (sf) => sf.category === SkillCategory.Technical,
              )}
              onSelectSkillFamily={(id) => {
                setSelectedTechnicalSkillFamilyId(id);
                technicalSkillsFamilySkillsPagination.setCurrentPage(1);
              }}
            />
            <SkillResults
              title={intl.formatMessage(
                {
                  defaultMessage: "Results ({skillCount})",
                  description: "A title for a skill list of results",
                },
                {
                  skillCount: technicalSkillFamilyFilteredSkills.length,
                },
              )}
              skills={technicalSkillsFamilySkillsPagination.currentTableData}
              addedSkills={selectedTechnicalSkills}
              onAddSkill={(id) => handleAddSkill(id)}
              onRemoveSkill={(id) => handleRemoveSkill(id)}
            />
            <Pagination
              ariaLabel={intl.formatMessage({
                defaultMessage: "Mainstream skills results",
              })}
              color="primary"
              mode="outline"
              currentPage={technicalSkillsFamilySkillsPagination.currentPage}
              pageSize={paginationPageSize}
              totalCount={technicalSkillFamilyFilteredSkills.length}
              onCurrentPageChange={(page) =>
                technicalSkillsFamilySkillsPagination.setCurrentPage(page)
              }
              onPageSizeChange={
                technicalSkillsFamilySkillsPagination.setPageSize
              }
            />
          </TabPanel>
          <TabPanel>
            {/* <SkillChecklist
              skillFamilies={allSkillFamilies}
              callback={handleSkillFamilyChange}
            />
            <SkillResults
              title={intl.formatMessage(
                {
                  defaultMessage: "Results ({skillCount})",
                  description: "A title for a skill list of results",
                },
                {
                  skillCount: familyFilteredSkills.length,
                },
              )}
              skills={mainstreamSkillsPagination.currentTableData}
              addedSkills={addedSkills || []}
              handleAddSkill={onAddSkill}
              handleRemoveSkill={onRemoveSkill}
            />
            <Pagination
              ariaLabel={intl.formatMessage({
                defaultMessage: "Mainstream skills results",
              })}
              color="primary"
              mode="outline"
              currentPage={mainstreamSkillsPagination.currentPage}
              pageSize={resultsPaginationPageSize}
              totalCount={familyFilteredSkills.length}
              onCurrentPageChange={(page) =>
                mainstreamSkillsPagination.setCurrentPage(page)
              }
              onPageSizeChange={mainstreamSkillsPagination.setPageSize}
            /> */}
          </TabPanel>
          <TabPanel>
            {/* <SearchBar handleSearch={handleSearch} />
            <SkillResults
              title={intl.formatMessage(
                {
                  defaultMessage: "Results ({skillCount})",
                  description: "A title for a list of results",
                },
                {
                  skillCount: searchFilteredSkills.length,
                },
              )}
              skills={keywordSearchPagination.currentTableData}
              addedSkills={addedSkills || []}
              handleAddSkill={onAddSkill}
              handleRemoveSkill={onRemoveSkill}
            />
            <Pagination
              ariaLabel={intl.formatMessage({
                defaultMessage: "keyword search skills results",
              })}
              color="primary"
              mode="outline"
              currentPage={keywordSearchPagination.currentPage}
              pageSize={resultsPaginationPageSize}
              totalCount={searchFilteredSkills.length}
              onCurrentPageChange={(page) =>
                keywordSearchPagination.setCurrentPage(page)
              }
              onPageSizeChange={keywordSearchPagination.setPageSize}
            /> */}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "Selected essential skills ({skillCount})",
            description: "A title for an essential skill list",
          },
          {
            skillCount: selectedTechnicalSkills.length,
          },
        )}
      </p>
      <Chips>
        {selectedTechnicalSkills.map((skill) => {
          return (
            <Chip
              key={skill.id}
              label={getLocalizedName(skill.name, intl)}
              color="primary"
              mode="outline"
              onDismiss={() => handleRemoveSkill(skill.id)}
            />
          );
        })}
      </Chips>
      <Button onClick={() => onSave(undefined)} color="cta" mode="solid">
        {intl.formatMessage({
          defaultMessage: "Save essential skills",
          description: "Text on a button to save the pool essential skills",
        })}
      </Button>
    </TableOfContents.Section>
  );
};

export default EssentialSkillsSection;
