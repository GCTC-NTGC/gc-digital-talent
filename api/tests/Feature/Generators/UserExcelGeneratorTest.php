<?php

namespace Tests\Feature\Generators;

use App\Enums\DevelopmentProgramParticipationStatus;
use App\Generators\UserExcelGenerator;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\DevelopmentProgram;
use App\Models\DevelopmentProgramUser;
use App\Models\EducationExperience;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Storage;
use OpenSpout\Reader\XLSX\Reader;
use Tests\TestCase;

class UserExcelGeneratorTest extends TestCase
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
        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $targetUser1 = User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->create();

        $targetUser2 = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->create();

        // act
        $fileName = sprintf('%s_%s', __('filename.users'), date('Y-m-d_His'));
        $generator = new UserExcelGenerator(
            fileName: $fileName,
            dir: 'test',
            lang: 'en',
        );

        $generator
            ->setAuthenticatedUserId($adminUser->id)
            ->setIds([$targetUser1->id, $targetUser2->id])
            ->setFilters([]);

        $generator->generate()->write();

        // assert
        $disk = Storage::disk('user_generated');
        $path = 'test'.DIRECTORY_SEPARATOR.$fileName.'.xlsx';

        $fileExists = $disk->exists($path);
        $this->assertTrue($fileExists, 'File was not generated');
        $fileSize = $disk->size($path);
        $this->assertGreaterThan(0, $fileSize, 'File is empty');
    }

    /**
     * Community interest sheet should have paired headers per development program:
     * "{program name}" and "{program name} - Linked experience"
     */
    public function testCommunityInterestSheetHasPairedDevProgramHeaders(): void
    {
        // arrange
        $adminUser = User::factory()->asApplicant()->asAdmin()->create();

        $community = Community::factory()->create();
        $program = DevelopmentProgram::factory()->withCommunity($community->id)->create();

        $employee = User::factory()->withGovEmployeeProfile()->create();
        CommunityInterest::factory()->create([
            'user_id' => $employee->id,
            'community_id' => $community->id,
            'consent_to_share_profile' => true,
        ]);

        // act
        $generator = new UserExcelGenerator(fileName: 'test_headers', dir: 'test', lang: 'en');
        $generator
            ->setAuthenticatedUserId($adminUser->id)
            ->setIds([$employee->id])
            ->setFilters([]);
        $generator->generate()->write();

        // assert: read headers from community interest sheet (sheet index 2, 0-based)
        [$headers] = $this->readSheetRows('test_headers', sheetIndex: 2, rowCount: 1);
        $headers = array_values(array_filter($headers));

        $programName = $program->name['en'];
        $expectedLinkedHeader = $programName.' - '.Lang::get('headings.linked_experience', [], 'en');

        $this->assertContains($programName, $headers, 'Development program name header missing');
        $this->assertContains($expectedLinkedHeader, $headers, 'Linked experience header missing');

        $programIndex = array_search($programName, $headers);
        $this->assertEquals($programIndex + 1, array_search($expectedLinkedHeader, $headers), 'Linked experience header must immediately follow program name header');
    }

    /**
     * A COMPLETED development program with a linked education experience should
     * show the experience title in the linked experience column, and
     * "Successfully completed" in the status column (no crash from null completion_date).
     */
    public function testCompletedDevProgramLinkedExperienceAppearsInSheet(): void
    {
        // arrange
        $adminUser = User::factory()->asApplicant()->asAdmin()->create();

        $community = Community::factory()->create();
        $program = DevelopmentProgram::factory()->withCommunity($community->id)->create();

        $employee = User::factory()->withGovEmployeeProfile()->create();
        CommunityInterest::factory()->create([
            'user_id' => $employee->id,
            'community_id' => $community->id,
            'consent_to_share_profile' => true,
        ]);

        $education = EducationExperience::factory()->create([
            'user_id' => $employee->id,
            'area_of_study' => 'Computer Science',
            'institution' => 'University of Ottawa',
        ]);

        DevelopmentProgramUser::create([
            'development_program_id' => $program->id,
            'user_id' => $employee->id,
            'participation_status' => DevelopmentProgramParticipationStatus::COMPLETED->name,
            'completion_date' => null,
            'education_experience_id' => $education->id,
        ]);

        // act
        $generator = new UserExcelGenerator(fileName: 'test_linked', dir: 'test', lang: 'en');
        $generator
            ->setAuthenticatedUserId($adminUser->id)
            ->setIds([$employee->id])
            ->setFilters([]);
        $generator->generate()->write();

        // assert: find status and linked experience columns by header
        [$headers, $dataRow] = $this->readSheetRows('test_linked', sheetIndex: 2, rowCount: 2);

        $programName = $program->name['en'];
        $statusColIndex = array_search($programName, $headers);
        $linkedColIndex = array_search($programName.' - '.Lang::get('headings.linked_experience', [], 'en'), $headers);

        $this->assertNotFalse($statusColIndex, 'Status column header not found');
        $this->assertNotFalse($linkedColIndex, 'Linked experience column header not found');

        $this->assertEquals(
            Lang::get('common.successfully_completed', [], 'en'),
            $dataRow[$statusColIndex],
            'Expected "Successfully completed" status for COMPLETED program with no date'
        );
        $this->assertEquals(
            $education->getTitle('en'),
            $dataRow[$linkedColIndex],
            'Linked education experience title should appear in linked experience column'
        );
    }

    /**
     * A COMPLETED development program without a linked experience should have
     * a null linked experience column (no crash).
     */
    public function testCompletedDevProgramWithNoLinkedExperienceIsNull(): void
    {
        // arrange
        $adminUser = User::factory()->asApplicant()->asAdmin()->create();

        $community = Community::factory()->create();
        $program = DevelopmentProgram::factory()->withCommunity($community->id)->create();

        $employee = User::factory()->withGovEmployeeProfile()->create();
        CommunityInterest::factory()->create([
            'user_id' => $employee->id,
            'community_id' => $community->id,
            'consent_to_share_profile' => true,
        ]);

        DevelopmentProgramUser::create([
            'development_program_id' => $program->id,
            'user_id' => $employee->id,
            'participation_status' => DevelopmentProgramParticipationStatus::COMPLETED->name,
            'completion_date' => null,
            'education_experience_id' => null,
        ]);

        // act
        $generator = new UserExcelGenerator(fileName: 'test_no_linked', dir: 'test', lang: 'en');
        $generator
            ->setAuthenticatedUserId($adminUser->id)
            ->setIds([$employee->id])
            ->setFilters([]);
        $generator->generate()->write();

        // assert
        [$headers, $dataRow] = $this->readSheetRows('test_no_linked', sheetIndex: 2, rowCount: 2);
        $linkedColIndex = array_search($program->name['en'].' - '.Lang::get('headings.linked_experience', [], 'en'), $headers);

        $this->assertNull($dataRow[$linkedColIndex] ?: null, 'Linked experience column should be null when no experience is linked');
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
