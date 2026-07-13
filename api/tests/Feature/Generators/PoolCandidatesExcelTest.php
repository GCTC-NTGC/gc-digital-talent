<?php

namespace Tests\Feature\Generators;

use App\Generators\PoolCandidateExcelGenerator;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use OpenSpout\Reader\XLSX\Reader;
use Tests\TestCase;

class PoolCandidatesExcelTest extends TestCase
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

        $targetUser = User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->create();

        $application1 = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->create(['user_id' => $targetUser->id]);

        $application2 = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->create(['user_id' => $targetUser->id]);

        // act
        $fileName = sprintf('%s_%s', __('filename.candidates_rod'), date('Y-m-d_His'));
        $generator = new PoolCandidateExcelGenerator(
            fileName: $fileName,
            dir: 'test',
            lang: 'en',
            withROD: true,
        );

        $generator
            ->setAuthenticatedUserId($adminUser->id)
            ->setIds([$application1->id, $application2->id])
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
     * The "community" filter should exclude candidates whose pool is not in
     * the filtered community, even when no explicit ids are set (full dataset download).
     */
    public function testCommunityFilterExcludesCandidatesOutsideCommunity(): void
    {
        // arrange
        $adminUser = User::factory()->asApplicant()->asAdmin()->create();

        $community = Community::factory()->create();
        $otherCommunity = Community::factory()->create();

        $pool = Pool::factory()->create(['community_id' => $community->id]);
        $otherPool = Pool::factory()->create(['community_id' => $otherCommunity->id]);

        $memberUser = User::factory()->asApplicant()->withNonGovProfile()->create();
        PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->for($memberUser)
            ->for($pool)
            ->create();

        $outsideUser = User::factory()->asApplicant()->withNonGovProfile()->create();
        PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->for($outsideUser)
            ->for($otherPool)
            ->create();

        // act
        $fileName = sprintf('%s_%s', __('filename.candidates_rod'), date('Y-m-d_His'));
        $generator = new PoolCandidateExcelGenerator(
            fileName: $fileName,
            dir: 'test',
            lang: 'en',
            withROD: true,
        );
        $generator
            ->setAuthenticatedUserId($adminUser->id)
            ->setIds(null)
            ->setFilters(['community' => ['id' => $community->id]]);
        $generator->generate()->write();

        // assert: only the candidate inside the filtered community appears (email is column index 13)
        $rows = $this->readSheetRows($fileName, sheetIndex: 0, rowCount: 10);
        array_shift($rows); // remove header row
        $emails = array_column($rows, 13);

        $this->assertContains($memberUser->email, $emails, 'Candidate inside the filtered community should appear');
        $this->assertNotContains($outsideUser->email, $emails, 'Candidate outside the filtered community should not appear');
    }

    // A free-text field starting with "=" must be written as text, not a formula.
    // OpenSpout's Cell::fromValue auto-detects it as a FormulaCell and emits an
    // <f> element, which Excel renders as #NAME? (or a live HYPERLINK injection).
    public function testNeutralizesFormulaInjection(): void
    {
        $adminUser = User::factory()->asApplicant()->asAdmin()->create();
        $targetUser = User::factory()->asApplicant()->withNonGovProfile()->create();

        // Same shape as the value that broke generation in production.
        $payload = '= To become more involved';
        $application = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->create(['user_id' => $targetUser->id, 'notes' => $payload]);

        $fileName = sprintf('%s_%s', __('filename.candidates_rod'), date('Y-m-d_His'));
        $generator = new PoolCandidateExcelGenerator(
            fileName: $fileName,
            dir: 'test',
            lang: 'en',
            withROD: true,
        );
        $generator
            ->setAuthenticatedUserId($adminUser->id)
            ->setIds([$application->id])
            ->setFilters([]);
        $generator->generate()->write();

        // gather the workbook xml (worksheets + shared strings)
        $path = Storage::disk('user_generated')->path('test'.DIRECTORY_SEPARATOR.$fileName.'.xlsx');
        $zip = new \ZipArchive();
        $zip->open($path);
        $xml = '';
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $name = $zip->getNameIndex($i);
            if (str_contains($name, 'worksheets/') || str_contains($name, 'sharedStrings')) {
                $xml .= $zip->getFromName($name);
            }
        }
        $zip->close();

        $this->assertStringContainsString('To become more involved', $xml, 'Notes value was not written');
        $this->assertStringNotContainsString('<f>', $xml, 'Notes value was written as a formula element');
    }

    /**
     * Read rows from a sheet in the generated file.
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
