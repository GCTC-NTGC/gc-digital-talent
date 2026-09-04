<?php

namespace Tests\Feature\Generators;

use App\Generators\NominationsExcelGenerator;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use OpenSpout\Reader\XLSX\Reader;
use Tests\TestCase;

class NominationsExcelGeneratorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([
            RolePermissionSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
        ]);
    }

    // test that a file can be generated
    public function testCanGenerateFile(): void
    {
        // arrange
        $community = Community::factory()->withWorkStreams()->create();

        $talentCoordinator = User::factory()
            ->withGovEmployeeProfile()
            ->asCommunityTalentCoordinator($community->id)
            ->create();

        $employee1 = User::factory()->withGovEmployeeProfile()->create();
        CommunityInterest::factory()->create([
            'user_id' => $employee1->id,
            'community_id' => $community->id,
            'consent_to_share_profile' => true,
        ]);

        $employee2 = User::factory()->withGovEmployeeProfile()->create();
        CommunityInterest::factory()->create([
            'user_id' => $employee2->id,
            'community_id' => $community->id,
            'consent_to_share_profile' => false,
        ]);

        $talentNominationEvent = TalentNominationEvent::factory()->create([
            'community_id' => $community->id,
        ]);
        $nomination1 = TalentNomination::factory()
            ->state([
                'nominee_id' => $employee1,
                'talent_nomination_event_id' => $talentNominationEvent->id,
            ])
            ->evaluated()
            ->create();
        $nominationGroup1 = $nomination1->talentNominationGroup;
        $nomination2 = TalentNomination::factory()
            ->state([
                'nominee_id' => $employee2,
                'talent_nomination_event_id' => $talentNominationEvent->id,
            ])
            ->evaluated()
            ->create();
        $nominationGroup2 = $nomination2->talentNominationGroup;

        // act
        $fileName = sprintf('%s_%s', __('filename.users'), date('Y-m-d_His'));
        $generator = new NominationsExcelGenerator(
            fileName: $fileName,
            talentNominationEventId: $talentNominationEvent->id,
            dir: 'test',
            lang: 'en'
        );

        $generator
            ->setAuthenticatedUserId($talentCoordinator->id)
            ->setIds([$nominationGroup1->id, $nominationGroup2->id]);

        $generator->generate()->write();

        // assert
        $disk = Storage::disk('user_generated');
        $path = 'test'.DIRECTORY_SEPARATOR.$fileName.'.xlsx';

        $fileExists = $disk->exists($path);
        $this->assertTrue($fileExists, 'File was not generated');
        $fileSize = $disk->size($path);
        $this->assertGreaterThan(0, $fileSize, 'File is empty');
    }

    // regression test for #17715: an archived nominee must not crash the whole export
    public function testSkipsArchivedNomineeWithoutCrashing(): void
    {
        // arrange
        $community = Community::factory()->withWorkStreams()->create();

        $talentCoordinator = User::factory()
            ->withGovEmployeeProfile()
            ->asCommunityTalentCoordinator($community->id)
            ->create();

        $employee1 = User::factory()->withGovEmployeeProfile()->create();
        $employee2 = User::factory()->withGovEmployeeProfile()->create();

        $talentNominationEvent = TalentNominationEvent::factory()->create([
            'community_id' => $community->id,
        ]);
        // nominee_id/talent_nomination_event_id are passed to create() (applied after all
        // chained states) rather than an earlier ->state([...]) call, since evaluated() chains
        // through submittedNomineeInformation(), whose own default nominee_id would otherwise
        // win and silently overwrite an earlier override with a random unrelated user
        $nomination1 = TalentNomination::factory()
            ->evaluated()
            ->create([
                'nominee_id' => $employee1->id,
                'talent_nomination_event_id' => $talentNominationEvent->id,
            ]);
        $nominationGroup1 = $nomination1->talentNominationGroup;
        $nomination2 = TalentNomination::factory()
            ->evaluated()
            ->create([
                'nominee_id' => $employee2->id,
                'talent_nomination_event_id' => $talentNominationEvent->id,
            ]);
        $nominationGroup2 = $nomination2->talentNominationGroup;

        // employee2 has since been archived; their nomination group must be silently
        // skipped rather than crashing the export for every other nominee
        $employee2->delete();

        // act
        $fileName = sprintf('%s_%s', __('filename.users'), date('Y-m-d_His'));
        $generator = new NominationsExcelGenerator(
            fileName: $fileName,
            talentNominationEventId: $talentNominationEvent->id,
            dir: 'test',
            lang: 'en'
        );

        $generator
            ->setAuthenticatedUserId($talentCoordinator->id)
            ->setIds([$nominationGroup1->id, $nominationGroup2->id]);

        $generator->generate()->write();

        // assert
        $disk = Storage::disk('user_generated');
        $path = 'test'.DIRECTORY_SEPARATOR.$fileName.'.xlsx';

        $this->assertTrue($disk->exists($path), 'File was not generated');
        $this->assertGreaterThan(0, $disk->size($path), 'File is empty');

        // the overview tab must contain exactly one nominee row (employee1's), not two -
        // confirming employee2 was silently excluded rather than the export just happening
        // to survive for some unrelated reason
        $rows = $this->readSheetRows($fileName, sheetIndex: 0, rowCount: 3);
        $dataRows = array_slice($rows, 1);
        $this->assertCount(1, $dataRows, 'Overview tab should only contain the active nominee');
        $this->assertEquals($employee1->id, $dataRows[0][0]);
    }

    public function testEveryTabHasMatchingHeadingAndDataCellCounts(): void
    {
        // arrange
        $community = Community::factory()->withWorkStreams()->create();

        $talentCoordinator = User::factory()
            ->withGovEmployeeProfile()
            ->asCommunityTalentCoordinator($community->id)
            ->create();

        $employee = User::factory()->withGovEmployeeProfile()->create();
        CommunityInterest::factory()
            ->for($employee)
            ->for($community)
            ->create(['consent_to_share_profile' => true]);

        $talentNominationEvent = TalentNominationEvent::factory()
            ->for($community)
            ->create();
        $nomination = TalentNomination::factory()
            ->evaluated()
            ->create([
                'nominee_id' => $employee->id,
                'talent_nomination_event_id' => $talentNominationEvent->id,
            ]);
        $nominationGroup = $nomination->talentNominationGroup;

        // act
        $fileName = sprintf('%s_%s', __('filename.users'), date('Y-m-d_His'));
        $generator = new NominationsExcelGenerator(
            fileName: $fileName,
            talentNominationEventId: $talentNominationEvent->id,
            dir: 'test',
            lang: 'en'
        );

        $generator
            ->setAuthenticatedUserId($talentCoordinator->id)
            ->setIds([$nominationGroup->id]);

        $generator->generate()->write();

        // assert
        foreach ([0, 1, 2] as $sheetIndex) {
            $rows = $this->readSheetRows($fileName, sheetIndex: $sheetIndex, rowCount: 2);
            $this->assertCount(2, $rows);
            $this->assertCount(count($rows[0]), $rows[1]);
        }
    }

    public function testOverviewTabRedactsGuardedColumnsWithoutConsent(): void
    {
        // arrange
        $community = Community::factory()->withWorkStreams()->create();

        $talentCoordinator = User::factory()
            ->withGovEmployeeProfile()
            ->asCommunityTalentCoordinator($community->id)
            ->create();

        $employee = User::factory()->withGovEmployeeProfile()->create();
        CommunityInterest::factory()
            ->for($employee)
            ->for($community)
            ->create(['consent_to_share_profile' => false]);

        $talentNominationEvent = TalentNominationEvent::factory()
            ->for($community)
            ->create();
        $nomination = TalentNomination::factory()
            ->evaluated()
            ->create([
                'nominee_id' => $employee->id,
                'talent_nomination_event_id' => $talentNominationEvent->id,
            ]);
        $nominationGroup = $nomination->talentNominationGroup;

        // act
        $fileName = sprintf('%s_%s', __('filename.users'), date('Y-m-d_His'));
        $generator = new NominationsExcelGenerator(
            fileName: $fileName,
            talentNominationEventId: $talentNominationEvent->id,
            dir: 'test',
            lang: 'en'
        );

        $generator
            ->setAuthenticatedUserId($talentCoordinator->id)
            ->setIds([$nominationGroup->id]);

        $generator->generate()->write();

        // assert
        $rows = $this->readSheetRows($fileName, sheetIndex: 0, rowCount: 2);
        $dataRow = $rows[1];

        $this->assertEquals($employee->id, $dataRow[0]);
        $this->assertEquals($employee->first_name, $dataRow[1]);
        $this->assertEquals($employee->last_name, $dataRow[2]);

        foreach ([7, 8, 10, 12] as $guardedColumn) {
            $this->assertEquals(__('common.not_available'), $dataRow[$guardedColumn]);
        }
    }

    /**
     * Read the first $rowCount rows from a specific sheet of a generated test file.
     * Returns an array of rows, each row being an array of cell values.
     *
     * @return array<int, array<int, mixed>>
     */
    private function readSheetRows(string $fileName, int $sheetIndex, int $rowCount): array
    {
        $path = Storage::disk('user_generated')->path('test'.DIRECTORY_SEPARATOR.$fileName.'.xlsx');

        $reader = new Reader();
        $reader->open($path);

        $rows = [];
        $currentSheet = 0;

        foreach ($reader->getSheetIterator() as $sheet) {
            if ($currentSheet === $sheetIndex) {
                $currentRow = 0;
                foreach ($sheet->getRowIterator() as $row) {
                    $rows[] = $row->toArray();
                    $currentRow++;
                    if ($currentRow >= $rowCount) {
                        break;
                    }
                }
                break;
            }
            $currentSheet++;
        }

        $reader->close();

        return $rows;
    }
}
