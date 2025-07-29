<?php

namespace Tests\Feature\Generators;

use App\Generators\ApplicationDocGenerator;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\CommunitySeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Spatie\Snapshots\MatchesSnapshots;
use Tests\TestCase;

use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertTrue;

class ApplicationDocGeneratorTest extends TestCase
{
    use MatchesSnapshots;
    use RefreshDatabase;
    use WithFaker;

    protected ApplicationDocGenerator $generator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpFaker();
        $this->faker->seed(0);

        $this->seed([
            RolePermissionSeeder::class,
            CommunitySeeder::class,
        ]);

        Department::factory()->create();
        Classification::factory()->create();

        $community = Community::where('key', 'digital')->sole();

        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $user = User::factory()
            ->asApplicant()
            ->asGovEmployee()
            ->withCommunityInterests([$community->id])
            ->withEmployeeProfile()
            ->withSkillsAndExperiences()
            ->create();

        $application = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->create(['user_id' => $user->id]);

        $application->submitted_at = config('constants.past_datetime');
        $application->save();

        $this->generator = new ApplicationDocGenerator(
            candidate: $application,
            dir: 'test',
            lang: 'en',
            authenticatedUser: $adminUser,
        );

        $this->generator->setUserId($adminUser->id);
    }

    // test that a file can be generated
    public function testCanGenerateFile(): void
    {

        $this->generator->generate()->write();
        $path = $this->generator->getRelativePath();

        // assert
        $disk = Storage::disk('userGenerated');

        $fileExists = $disk->exists($path);
        assertTrue($fileExists, 'File was not generated');
        $fileSize = $disk->size($path);
        assertGreaterThan(0, $fileSize, 'File is empty');
    }

    // NOTE: Update with `-d --update-snapshots`
    public function testApplicationDocSnapshot()
    {
        $this->generator
            ->setExtension('html')
            ->generate()
            ->write();

        $disk = Storage::disk('userGenerated');
        $contents = $disk->get($this->generator->getRelativePath());

        $this->assertMatchesHtmlSnapshot($contents);

    }
}
