<?php

namespace Tests\Feature\Generators;

use App\Generators\PoolCandidateExcelGenerator;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\IOFactory;
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

    // A free-text field starting with "=" must not be treated as a formula.
    // Previously this threw a TypeError out of PhpSpreadsheet during save.
    public function testNeutralizesFormulaInjection(): void
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

        $payload = '=HYPERLINK("http://evil.test","To become more involved")';
        $application = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->create([
                'user_id' => $targetUser->id,
                'notes' => $payload,
            ]);

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
            ->setIds([$application->id])
            ->setFilters([]);

        // would throw before the NonFormulaValueBinder fix
        $generator->generate()->write();

        // assert: the payload was written as inert text, not a formula
        $path = Storage::disk('user_generated')->path('test'.DIRECTORY_SEPARATOR.$fileName.'.xlsx');
        $sheet = IOFactory::load($path)->getActiveSheet();

        $found = null;
        foreach ($sheet->getRowIterator() as $row) {
            foreach ($row->getCellIterator() as $cell) {
                if ($cell->getValue() === $payload) {
                    $found = $cell;
                    break 2;
                }
            }
        }

        $this->assertNotNull($found, 'Payload cell was not found in the generated file');
        $this->assertNotSame(DataType::TYPE_FORMULA, $found->getDataType(), 'Payload was written as a formula');
        $this->assertSame($payload, $found->getValue(), 'Payload content was altered');
    }
}
