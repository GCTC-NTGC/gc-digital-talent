import * as React from "react";
import { useMemo } from "react";
import TableOfContents from "@common/components/TableOfContents";
import {
  Maybe,
  PoolAdvertisement,
  Skill,
  SkillCategory,
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
// import SkillFamilyPicker from "@common/skills/SkillFamilyPicker";

import SkillFamilyPicker from "@common/components/skills/SkillFamilyPicker/SkillFamilyPicker";

import { invertSkillSkillFamilyTree } from "@common/helpers/skillUtils";
import { SectionMetadata } from "./EditPool";

interface EssentialSkillsSectionProps {
  poolAdvertisement: PoolAdvertisement;
  skills: Array<Maybe<Skill>>;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: unknown) => void;
}

const handleSkillFamilyChange = (x: unknown) => console.log(x);

export const EssentialSkillsSection = ({
  poolAdvertisement,
  skills,
  sectionMetadata,
  onSave,
}: EssentialSkillsSectionProps): JSX.Element => {
  const intl = useIntl();

  // this function can be a bit heavy
  const allSkillFamilies = useMemo(
    () => invertSkillSkillFamilyTree(skills.filter(notEmpty)),
    [skills],
  );

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
              onSelectSkillFamily={handleSkillFamilyChange}
            />
            {/* <SkillResults
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
            /> */}
            {/* <Pagination
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
