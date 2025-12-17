<?php

namespace Tests\Feature\Generators;

use App\Generators\JobPosterTemplateGenerator;
use App\Models\Classification;
use App\Models\JobPosterTemplate;
use App\Models\User;
use App\Models\WorkStream;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Spatie\Snapshots\MatchesSnapshots;
use Tests\TestCase;

use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertTrue;

class JobPosterTemplateGeneratorTest extends TestCase
{
    use MatchesSnapshots;
    use RefreshDatabase;
    use WithFaker;

    protected JobPosterTemplateGenerator $generator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpFaker();
        $this->faker->seed(0);

        $this->seed(RolePermissionSeeder::class);

        Classification::factory()->create();
        WorkStream::factory()->create();

        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $jobPosterTemplate = JobPosterTemplate::factory()
            ->withSkills()
            ->create();

        $this->generator = new JobPosterTemplateGenerator(
            jobPoster: $jobPosterTemplate,
            dir: 'test',
            lang: 'en'
        );

        $this->generator->setAuthenticatedUserId($adminUser->id);

    }

    // test that a file can be generated
    public function testCanGenerateFile(): void
    {
        // act
        $this->generator->generate()->write();

        // assert
        $path = $this->generator->getRelativePath();
        $disk = Storage::disk('user_generated');

        $fileExists = $disk->exists($path);
        assertTrue($fileExists, 'File was not generated');
        $fileSize = $disk->size($path);
        assertGreaterThan(0, $fileSize, 'File is empty');
    }

    // NOTE: Update with `-d --update-snapshots`
    public function testJobPosterTemplateDocSnapshot()
    {
        $this->generator
            ->setExtension('html')
            ->generate()
            ->write();

        $disk = Storage::disk('user_generated');
        $contents = $disk->get($this->generator->getRelativePath());

        $this->assertMatchesHtmlSnapshot($contents);
    }
}
