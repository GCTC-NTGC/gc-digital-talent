<?php

namespace Tests\Feature\Generators;

use App\Enums\PoolSkillType;
use App\Enums\SkillCategory;
use App\Enums\SkillLevel;
use App\Enums\SupervisoryStatus;
use App\Generators\JobPosterTemplateGenerator;
use App\Models\Classification;
use App\Models\Community;
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

        // Create all models with explicit, deterministic data for snapshot stability
        $community = Community::factory()->create([
            'name' => ['en' => 'Test Community EN', 'fr' => 'Test Community FR'],
        ]);

        $classification = Classification::factory()->create([
            'group' => 'IT',
            'level' => 3,
            'name' => ['en' => 'Information Technology', 'fr' => 'Technologie de l\'information'],
        ]);

        $workStream = WorkStream::factory()->create([
            'name' => ['en' => 'Software Development EN', 'fr' => 'Développement de logiciels FR'],
            'community_id' => $community->id,
        ]);

        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => 'admin@test.com',
            ]);

        // Create skills with fixed data
        $technicalSkill1 = Skill::factory()->create([
            'name' => ['en' => 'Skill Technical 1 EN', 'fr' => 'Skill Technical 1 FR'],
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        $technicalSkill2 = Skill::factory()->create([
            'name' => ['en' => 'Skill Technical 2 EN', 'fr' => 'Skill Technical 2 FR'],
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        $behaviouralSkill1 = Skill::factory()->create([
            'name' => ['en' => 'Skill Behavioural 1 EN', 'fr' => 'Skill Behavioural 1 FR'],
            'category' => SkillCategory::BEHAVIOURAL->name,
        ]);

        // Create JobPosterTemplate with explicit data (no faker)
        $jobPosterTemplate = JobPosterTemplate::create([
            'supervisory_status' => SupervisoryStatus::SUPERVISOR->name,
            'work_stream_id' => $workStream->id,
            'reference_id' => 'test_reference_id',
            'classification_id' => $classification->id,
            'name' => ['en' => 'Test Job Poster Template EN', 'fr' => 'Test Job Poster Template FR'],
            'description' => ['en' => 'Test description for job poster template. EN', 'fr' => 'Description de test pour le modèle d\'affiche d\'emploi. FR'],
            'tasks' => [
                'en' => '<ul><li><p>Task one description EN</p></li><li><p>Task two description EN</p></li></ul>',
                'fr' => '<ul><li><p>Description de la tâche un FR</p></li><li><p>Description de la tâche deux FR</p></li></ul>',
            ],
            'keywords' => ['en' => ['keyword1', 'keyword2'], 'fr' => ['motcle1', 'motcle2']],
            'work_description' => ['en' => 'https://example.com/work-desc-en', 'fr' => 'https://example.com/work-desc-fr'],
            'essential_technical_skills_notes' => ['en' => 'Essential technical skills note EN', 'fr' => 'Note compétences techniques essentielles FR'],
            'essential_behavioural_skills_notes' => ['en' => 'Essential behavioural skills note EN', 'fr' => 'Note compétences comportementales essentielles FR'],
            'nonessential_technical_skills_notes' => ['en' => 'Asset technical skills note EN', 'fr' => 'Note compétences techniques atout FR'],
        ]);

        // Attach skills with fixed data
        $jobPosterTemplate->jobPosterTemplateSkills()->create([
            'skill_id' => $technicalSkill1->id,
            'type' => PoolSkillType::ESSENTIAL->name,
            'required_skill_level' => SkillLevel::ADVANCED->name,
        ]);
        $jobPosterTemplate->jobPosterTemplateSkills()->create([
            'skill_id' => $behaviouralSkill1->id,
            'type' => PoolSkillType::ESSENTIAL->name,
            'required_skill_level' => SkillLevel::INTERMEDIATE->name,
        ]);
        $jobPosterTemplate->jobPosterTemplateSkills()->create([
            'skill_id' => $technicalSkill2->id,
            'type' => PoolSkillType::NONESSENTIAL->name,
            'required_skill_level' => null,
        ]);

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
