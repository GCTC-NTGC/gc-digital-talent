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
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DefaultValueBinder;
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

    // A free-text field starting with "=" must not be typed as a formula. An
    // invalid formula like "= To become more involved" crashed PhpSpreadsheet
    // with a TypeError when the writer tried to calculate it. The binder lives
    // on the Spreadsheet instance because generate() runs in a queue worker,
    // not where the generator was constructed.
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

        // Exact shape of the value that crashed in production: an invalid formula.
        $payload = '= To become more involved';

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

        // Simulate the queue worker: the process running generate() has the
        // default global binder, so the fix must not rely on construction-time state.
        Cell::setValueBinder(new DefaultValueBinder());

        $generator->generate()->write();

        // assert: the file was produced (write() above would have thrown the
        // TypeError before the fix) and the value is text, not a formula element
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

        $this->assertStringContainsString('To become more involved', $xml, 'Payload text was not written to the file');
        $this->assertStringNotContainsString('<f>', $xml, 'Payload was written as a formula element');
    }
}
