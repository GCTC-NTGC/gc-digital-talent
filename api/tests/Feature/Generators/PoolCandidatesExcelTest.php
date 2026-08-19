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
use Tests\ReadsGeneratedFiles;
use Tests\TestCase;

class PoolCandidatesExcelTest extends TestCase
{
    use ReadsGeneratedFiles;
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

        // assert: a candidate filtered out is not written to the file, so their email is absent from it
        $text = $this->readWorkbookText($fileName);

        $this->assertStringContainsString($memberUser->email, $text, 'Candidate inside the filtered community should appear');
        $this->assertStringNotContainsString($outsideUser->email, $text, 'Candidate outside the filtered community should not appear');
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

        $xml = $this->readWorkbookText($fileName);

        $this->assertStringContainsString('To become more involved', $xml, 'Notes value was not written');
        $this->assertStringNotContainsString('<f>', $xml, 'Notes value was written as a formula element');
    }
}
