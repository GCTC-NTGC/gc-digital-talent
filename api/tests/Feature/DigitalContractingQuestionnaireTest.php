<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\DigitalContractingQuestionnaire;
use App\Models\Skill;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;

class DigitalContractingQuestionnaireTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->markTestSkipped('Feature does not have an imminent launch.');

        $this->seed(RolePermissionSeeder::class);

        $this->bootRefreshesSchemaCache();

        $this->user = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'sub' => 'platform-admin@test.com',
            ]);
    }

    // make sure the factory works
    public function testFactoryWorks(): void
    {
        Department::factory()->count(10)->create();
        Skill::factory()->count(10)->create();

        $questionnaires = DigitalContractingQuestionnaire::factory()->count(10)->create();

        assertEquals(10, $questionnaires->count());
    }

    // create a new questionnaire and make sure it comes back the same way
    public function testCanCreate(): void
    {
        $department = Department::factory()->create();
        $skill = Skill::factory()->create();

        $questionnaireTableFields = [
            'departmentOther' => null,
            'branchOther' => 'branch_other',
            'businessOwnerName' => 'business_owner_name',
            'businessOwnerJobTitle' => 'business_owner_job_title',
            'businessOwnerEmail' => 'owner@example.org',
            'financialAuthorityName' => 'financial_authority_name',
            'financialAuthorityJobTitle' => 'financial_authority_job_title',
            'financialAuthorityEmail' => 'authority@example.org',
            'authoritiesInvolved' => ['HR', 'OTHER'],
            'authorityInvolvedOther' => 'authority_involved_other',
            'contractBehalfOfGc' => 'YES',
            'contractServiceOfGc' => 'YES',
            'contractForDigitalInitiative' => 'YES',
            'digitalInitiativeName' => 'digital_initiative_name',
            'digitalInitiativePlanSubmitted' => 'YES',
            'digitalInitiativePlanUpdated' => 'YES',
            'digitalInitiativePlanComplemented' => 'YES',
            'contractTitle' => 'contract_title',
            'contractStartDate' => '1900-01-01',
            'contractEndDate' => '2099-12-31',
            'contractExtendable' => 'YES',
            'contractAmendable' => 'YES',
            'contractMultiyear' => 'YES',
            'contractValue' => 'FROM_0_TO_10K',
            'contractFtes' => 'FROM_11_TO_30',
            'contractResourcesStartTimeframe' => 'FROM_0_TO_3M',
            'commodityType' => 'OTHER',
            'commodityTypeOther' => 'commodity_type_other',
            'instrumentType' => 'OTHER',
            'instrumentTypeOther' => 'instrument_type_other',
            'methodOfSupply' => 'OTHER',
            'methodOfSupplyOther' => 'method_of_supply_other',
            'solicitationProcedure' => 'ADVANCE_CONTRACT_AWARD_NOTICE',
            'subjectToTradeAgreement' => 'YES',
            'workRequirementDescription' => 'work_requirement_description',
            'hasPersonnelRequirements' => 'YES',
            'qualificationRequirement' => 'qualification_requirement',
            'requirementAccessToSecure' => 'YES',
            'requirementScreeningLevels' => ['RELIABILITY', 'OTHER'],
            'requirementScreeningLevelOther' => 'requirement_screening_level_other',
            'requirementWorkLanguages' => ['ENGLISH_ONLY', 'OTHER'],
            'requirementWorkLanguageOther' => 'requirement_work_language_other',
            'requirementWorkLocations' => ['GC_PREMISES', 'OFFSITE_SPECIFIC'],
            'requirementWorkLocationGcSpecific' => 'requirement_work_location_gc_specific',
            'requirementWorkLocationOffsiteSpecific' => 'requirement_work_location_offsite_specific',
            'requirementOthers' => ['SHIFT_WORK', 'OTHER'],
            'requirementOtherOther' => 'requirement_other_other',
            'isTechnologicalChange' => 'YES',
            'hasImpactOnYourDepartment' => 'YES',
            'hasImmediateImpactOnOtherDepartments' => 'YES',
            'hasFutureImpactOnOtherDepartments' => 'YES',
            'operationsConsiderations' => ['FINANCE_VEHICLE_NOT_USABLE', 'OTHER'],
            'operationsConsiderationsOther' => 'operations_considerations_other',
            'contractingRationalePrimary' => 'SHORTAGE_OF_TALENT',
            'contractingRationalePrimaryOther' => null,
            'contractingRationalesSecondary' => ['TIMING_REQUIREMENTS', 'OTHER'],
            'contractingRationalesSecondaryOther' => 'contracting_rationales_secondary_other',
            'ocioConfirmedTalentShortage' => 'YES',
            'talentSearchTrackingNumber' => 'talent_search_tracking_number',
            'ongoingNeedForKnowledge' => 'YES',
            'knowledgeTransferInContract' => 'YES',
            'employeesHaveAccessToKnowledge' => 'YES',
            'ocioEngagedForTraining' => 'YES',
        ];

        $personnelRequirementFields = [
            'language' => 'OTHER',
            'languageOther' => 'language_other',
            'security' => 'OTHER',
            'securityOther' => 'security_other',
            'telework' => 'FULL_TIME',
            'quantity' => 1,
        ];

        $skillRequirementFields = [
            'level' => 'BEGINNER',
        ];

        // build the expected object with relationship fields
        $expectedObject = $questionnaireTableFields;
        Arr::set($expectedObject, 'department.id', $department->id);
        Arr::set($expectedObject, 'personnelRequirements.0', $personnelRequirementFields);
        Arr::set($expectedObject, 'personnelRequirements.0.skillRequirements.0', $skillRequirementFields);
        Arr::set($expectedObject, 'personnelRequirements.0.skillRequirements.0.skill.id', $skill->id);

        // graphql inputs have to be tweaked a bit for relationships (connect, create)
        $graphqlInput = $questionnaireTableFields;
        Arr::set($graphqlInput, 'department.connect', $department->id);
        Arr::set($graphqlInput, 'personnelRequirements.create.0', $personnelRequirementFields);
        Arr::set($graphqlInput, 'personnelRequirements.create.0.skillRequirements.create.0', $skillRequirementFields);
        Arr::set($graphqlInput, 'personnelRequirements.create.0.skillRequirements.create.0.skill.connect', $skill->id);

        // create it in the database and check what comes back
        $this->actingAs($this->user, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
                mutation CreateDigitalContractingQuestionnaire($questionnaire: DigitalContractingQuestionnaireInput!) {
                    createDigitalContractingQuestionnaire(
                      digitalContractingQuestionnaire: $questionnaire
                    ) {
                        authoritiesInvolved
                        authorityInvolvedOther
                        branchOther
                        businessOwnerEmail
                        businessOwnerJobTitle
                        businessOwnerName
                        commodityType
                        commodityTypeOther
                        contractAmendable
                        contractBehalfOfGc
                        contractEndDate
                        contractExtendable
                        contractForDigitalInitiative
                        contractMultiyear
                        contractResourcesStartTimeframe
                        contractServiceOfGc
                        contractStartDate
                        contractTitle
                        contractValue
                        contractFtes
                        contractingRationalePrimary
                        contractingRationalePrimaryOther
                        contractingRationalesSecondary
                        contractingRationalesSecondaryOther
                        department { id }
                        departmentOther
                        digitalInitiativeName
                        digitalInitiativePlanComplemented
                        digitalInitiativePlanSubmitted
                        digitalInitiativePlanUpdated
                        employeesHaveAccessToKnowledge
                        financialAuthorityEmail
                        financialAuthorityJobTitle
                        financialAuthorityName
                        hasFutureImpactOnOtherDepartments
                        hasImmediateImpactOnOtherDepartments
                        hasImpactOnYourDepartment
                        hasPersonnelRequirements
                        instrumentType
                        instrumentTypeOther
                        isTechnologicalChange
                        knowledgeTransferInContract
                        methodOfSupply
                        methodOfSupplyOther
                        ocioConfirmedTalentShortage
                        ocioEngagedForTraining
                        ongoingNeedForKnowledge
                        operationsConsiderations
                        operationsConsiderationsOther
                        personnelRequirements {
                            language
                            languageOther
                            quantity
                            resourceType
                            security
                            securityOther
                            skillRequirements {
                                level
                                skill { id }
                            }
                            telework
                        }
                        qualificationRequirement
                        requirementAccessToSecure
                        requirementScreeningLevelOther
                        requirementScreeningLevels
                        requirementWorkLanguageOther
                        requirementWorkLanguages
                        requirementWorkLocationGcSpecific
                        requirementWorkLocationOffsiteSpecific
                        requirementWorkLocations
                        requirementOthers
                        requirementOtherOther
                        solicitationProcedure
                        subjectToTradeAgreement
                        talentSearchTrackingNumber
                        workRequirementDescription
                    }
                }
        ',
                ['questionnaire' => $graphqlInput]
            )
            ->assertJson([
                'data' => [
                    'createDigitalContractingQuestionnaire' => $expectedObject,
                ],
            ]);
    }
}
