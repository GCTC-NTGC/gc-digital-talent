<?php

namespace Tests\Feature\Generators;

use App\Enums\PoolSkillType;
use App\Enums\SkillCategory;
use App\Enums\SkillLevel;
use App\Enums\SupervisoryStatus;
use App\Generators\JobPosterTemplateGenerator;
use App\Models\Classification;
use App\Models\JobPosterTemplate;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkStream;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Spatie\Snapshots\MatchesSnapshots;
use Tests\TestCase;

use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertTrue;

class JobPosterTemplateGeneratorTest extends TestCase
{
    use MatchesSnapshots;
    use RefreshDatabase;

    protected JobPosterTemplateGenerator $generator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        // Create deterministic fixture data for snapshot tests.
        // All values are hardcoded to ensure stability regardless of
        // any changes to factory faker usage.

        $classification = Classification::factory()->create([
            'group' => 'JP',
            'level' => 2,
        ]);

        $workStream = WorkStream::factory()->create([
            'name' => ['en' => 'Job Template WorkStream EN', 'fr' => 'Job Template WorkStream FR'],
        ]);

        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'first_name' => 'Admin',
                'last_name' => 'JobPoster',
                'email' => 'admin.jobposter@test.com',
            ]);

        // Create deterministic skills for the template
        $technicalSkills = [];
        foreach (['Tech Skill A', 'Tech Skill B', 'Tech Skill C'] as $name) {
            $technicalSkills[] = Skill::factory()->create([
                'name' => ['en' => "{$name} EN", 'fr' => "{$name} FR"],
                'category' => SkillCategory::TECHNICAL->name,
            ]);
        }

        $behaviouralSkills = [];
        foreach (['Behavioural Skill A', 'Behavioural Skill B', 'Behavioural Skill C'] as $name) {
            $behaviouralSkills[] = Skill::factory()->create([
                'name' => ['en' => "{$name} EN", 'fr' => "{$name} FR"],
                'category' => SkillCategory::BEHAVIOURAL->name,
            ]);
        }

        // Create job poster template with deterministic values
        $keyTasksHtml = '<ul><li><p>Task one for snapshot</p></li><li><p>Task two for snapshot</p></li></ul>';

        $jobPosterTemplate = JobPosterTemplate::factory()->create([
            'supervisory_status' => SupervisoryStatus::SUPERVISOR->name,
            'work_stream_id' => $workStream->id,
            'reference_id' => 'snapshot_template_ref',
            'classification_id' => $classification->id,
            'name' => [
                'en' => 'Snapshot Job Template EN',
                'fr' => 'Snapshot Job Template FR',
            ],
            'description' => [
                'en' => 'Deterministic description for snapshot testing EN.',
                'fr' => 'Deterministic description for snapshot testing FR.',
            ],
            'tasks' => [
                'en' => $keyTasksHtml,
                'fr' => $keyTasksHtml,
            ],
            'keywords' => [
                'en' => ['snapshot', 'test', 'keyword'],
                'fr' => ['snapshot', 'test', 'motcle'],
            ],
            'work_description' => [
                'en' => 'https://example.com/work-en',
                'fr' => 'https://example.com/work-fr',
            ],
            'essential_technical_skills_notes' => [
                'en' => 'Essential technical notes EN.',
                'fr' => 'Essential technical notes FR.',
            ],
            'essential_behavioural_skills_notes' => [
                'en' => 'Essential behavioural notes EN.',
                'fr' => 'Essential behavioural notes FR.',
            ],
            'nonessential_technical_skills_notes' => [
                'en' => 'Nonessential technical notes EN.',
                'fr' => 'Nonessential technical notes FR.',
            ],
        ]);

        // Attach skills manually with deterministic skill levels
        foreach ($technicalSkills as $index => $skill) {
            $jobPosterTemplate->jobPosterTemplateSkills()->create([
                'skill_id' => $skill->id,
                'type' => PoolSkillType::ESSENTIAL->name,
                'required_skill_level' => SkillLevel::INTERMEDIATE->name,
            ]);
        }

        foreach ($behaviouralSkills as $skill) {
            $jobPosterTemplate->jobPosterTemplateSkills()->create([
                'skill_id' => $skill->id,
                'type' => PoolSkillType::ESSENTIAL->name,
                'required_skill_level' => SkillLevel::ADVANCED->name,
            ]);
        }

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
