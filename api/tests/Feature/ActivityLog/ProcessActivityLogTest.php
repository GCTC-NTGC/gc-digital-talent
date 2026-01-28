<?php

namespace Tests\Feature\ActivityLog;

use App\Enums\ActivityEvent;
use App\Enums\AssessmentStepType;
use App\Enums\PoolCandidateStatus;
use App\Enums\PoolSkillType;
use App\Enums\SkillLevel;
use App\Models\AssessmentStep;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class ProcessActivityLogTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $communityRecruiter;

    protected User $processOperator;

    protected Pool $process;

    protected PoolCandidate $candidate;

    protected Skill $skill;

    protected AssessmentStep $step;

    protected $query = <<<'GRAPHQL'
    query ProcessActivitySearch($id: UUID!, $where: ProcessActivityFilterInput) {
        pool(id: $id) {
            activities(where: $where) {
                data {
                    subjectId
                    causer { id }
                }
            }
        }
    }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        // Mock time for date range test
        $yesterday = now()->subDay();
        Carbon::setTestNow($yesterday);

        $this->process = Pool::factory()->draft()->create();

        $this->communityRecruiter = User::factory()
            ->asCommunityRecruiter($this->process->community_id)
            ->create(['first_name' => 'Rachel', 'last_name' => 'Recruiter']);
        $this->processOperator = User::factory()
            ->asProcessOperator($this->process->id)
            ->create(['first_name' => 'Oscar', 'last_name' => 'Operator']);

        // Login as community recruiter for pool object changes
        Auth::login($this->communityRecruiter);

        // NOISE data (pool, skills, steps)
        $this->process->update([
            'about_us' => ['en' => 'Noise about us (en)', 'fr' => 'Noise about us (fr)'],
            'special_note' => ['en' => 'Noise note (en)', 'fr' => 'Noise note (fr)'],
        ]);

        $noiseSkill = Skill::factory()->create([
            'name' => ['en' => 'NoiseSkill (en)', 'fr' => 'NoiseSkill (fr)'],
        ]);
        $noisePoolSkill = $this->process->poolSkills()->create([
            'skill_id' => $noiseSkill->id,
            'type' => PoolSkillType::ESSENTIAL->name,
            'required_skill_level' => SkillLevel::BEGINNER->name,
        ]);
        $noisePoolSkill->update(['required_skill_level' => SkillLevel::INTERMEDIATE->name]);
        $noisePoolSkill->delete();

        $noiseStep = $this->process->assessmentSteps()->create([
            'type' => AssessmentStepType::INTERVIEW_GROUP->name,
            'title' => ['en' => 'Noise Assessment Step (en)', 'fr' => 'Noise Assessment Step (fr)'],
        ]);
        $noiseStep->update(['title' => ['en' => 'Updated Noise (en)', 'fr' => 'Updated Noise (fr)']]);

        // NEEDLE Skill/PoolSkill
        $this->skill = Skill::factory()->create([
            'name' => ['en' => 'NeedleSkill (en)', 'fr' => 'NeedleSkill (fr)'],
        ]);
        $needlePoolSkill = $this->process->poolSkills()->create([
            'skill_id' => $this->skill->id,
            'type' => PoolSkillType::ESSENTIAL->name,
            'required_skill_level' => SkillLevel::ADVANCED->name,
        ]);
        $needlePoolSkill->update(['required_skill_level' => SkillLevel::LEAD->name]);

        // NEEDLE AssessmentStep
        $this->step = $this->process->assessmentSteps()->create([
            'type' => AssessmentStepType::REFERENCE_CHECK->name,
            'title' => ['en' => 'Needle Assessment Step (en)', 'fr' => 'Needle Assessment Step (fr)'],
        ]);
        $this->step->update(['title' => ['en' => 'Needle Step Updated (en)', 'fr' => 'Needle Step Updated (fr)']]);

        $this->process->publish();

        // Candidate "needle"
        $needleUser = User::factory()->create([
            'first_name' => 'NeedleFirst', 'last_name' => 'FindMe',
        ]);
        $this->candidate = PoolCandidate::factory()->create([
            'pool_id' => $this->process->id,
            'user_id' => $needleUser->id,
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
        ]);

        // Reset time to have different createdAt
        Carbon::setTestNow();

        // Candidate logs: submit as themselves
        Auth::login($needleUser);
        $this->candidate->submit('NeedleFirst FindMe');

        // Candidate qualifies (done by process operator)
        Auth::login($this->processOperator);
        $this->candidate->qualify(now()->addMonths(6));

        Auth::logout();
    }

    public function testSearchCauser()
    {
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'generalSearch' => $this->processOperator->first_name,
                ],
            ])
            // positive: operator must be present
            ->assertJsonFragment([
                'causer' => ['id' => $this->processOperator->id],
            ])
            // negative: recruiter must NOT be present
            ->assertJsonMissing([
                'causer' => ['id' => $this->communityRecruiter->id],
            ]);

        $response = $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'generalSearch' => 'DefinitelyNotAUser',
                ],
            ]);
        $this->assertEmpty(
            data_get($response->json(), 'data.pool.activities.data'),
            'No logs should be returned for a non-existent causer name'
        );
    }

    public function testSearchPoolCandidateUser()
    {
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'generalSearch' => $this->candidate->user->first_name, // 'NeedleFirst'
                ],
            ])
            ->assertJsonFragment([
                'subjectId' => $this->candidate->id,
            ])
            ->assertJsonMissing([
                'subjectId' => $this->processOperator->id,
            ]) // noise: shouldn't match other unrelated IDs
            ->assertJsonMissing([
                'subjectId' => $this->communityRecruiter->id,
            ]);
    }

    public function testSearchSkillName()
    {
        $needlePoolSkillId = $this->process->poolSkills()->where('skill_id', $this->skill->id)->first()->id;

        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'generalSearch' => $this->skill->name['en'], // 'NeedleSkill (en)'
                ],
            ])
            ->assertJsonFragment([
                'subjectId' => $needlePoolSkillId,
            ])
            ->assertJsonMissing([
                'subjectId' => $this->candidate->id,
            ]);
    }

    public function testSearchAssessmentStepTitle()
    {
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'generalSearch' => $this->step->title['en'], // 'Needle Assessment Step (en)'
                ],
            ])
            ->assertJsonFragment([
                'subjectId' => $this->step->id,
            ])
            ->assertJsonMissing([
                'subjectId' => $this->candidate->id,
            ]);
    }

    public function testSearchAssessmentStepTypeDisplayString()
    {
        $displayType = AssessmentStepType::localizedString($this->step->type)['en'];
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'generalSearch' => $displayType,
                ],
            ])
            ->assertJsonFragment([
                'subjectId' => $this->step->id,
            ])
            ->assertJsonMissing([
                'subjectId' => $this->candidate->id,
            ]);
    }

    public function testSearchNoiseExclusion()
    {
        $needlePoolSkillId = $this->process->poolSkills()->where('skill_id', $this->skill->id)->first()->id;

        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'generalSearch' => 'NoiseSkill', // should NOT match NeedleSkill
                ],
            ])
            ->assertJsonMissing([
                'subjectId' => $needlePoolSkillId,
            ])
            ->assertJsonMissing([
                'subjectId' => $this->step->id,
            ])
            ->assertJsonMissing([
                'subjectId' => $this->candidate->id,
            ]);
    }

    public function testSearchNoResults()
    {
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'generalSearch' => 'DefinitelyNotInTheLog',
                ],
            ])
            ->assertJsonCount(0, 'data.pool.activities.data');
    }

    public function testFilterByDateRange()
    {
        $today = now()->format('Y-m-d');
        $yesterday = now()->subDay()->format('Y-m-d');
        $tomorrow = now()->addDay()->format('Y-m-d');

        // Check "yesterday" logs appear, "today" does not
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'createdAt' => ['start' => $yesterday, 'end' => $yesterday],
                ],
            ])
            ->assertJsonFragment(['subjectId' => $this->step->id])
            ->assertJsonMissing(['subjectId' => $this->candidate->id]); // qualify happened today

        // Check "today" logs appear, "yesterday" did not
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'createdAt' => ['start' => $today, 'end' => $today],
                ],
            ])
            ->assertJsonFragment(['subjectId' => $this->candidate->id])
            ->assertJsonMissing(['subjectId' => $this->step->id]);

        // Inclusive check, all logs should appear
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'createdAt' => ['start' => $yesterday, 'end' => $today],
                ],
            ])
            ->assertJsonFragment(['subjectId' => $this->step->id])
            ->assertJsonFragment(['subjectId' => $this->candidate->id]);

        // Future check, no logs should appear
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'createdAt' => ['start' => $tomorrow, 'end' => $tomorrow],
                ],
            ])
            ->assertJsonCount(0, 'data.pool.activities.data');
    }

    public function testFilterByExplicitCauser()
    {
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'causers' => [$this->processOperator->id],
                ],
            ])
            ->assertJsonFragment(['causer' => ['id' => $this->processOperator->id]])
            ->assertJsonMissing(['causer' => ['id' => $this->communityRecruiter->id]]);
    }

    public function testFilterByEvents()
    {

        // Positive test, check for existing event
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'events' => [ActivityEvent::QUALIFIED->name],
                ],
            ])
            ->assertJsonFragment(['subjectId' => $this->candidate->id]);

        // Negative test, check for non-existent event
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->query, [
                'id' => $this->process->id,
                'where' => [
                    'events' => [ActivityEvent::DELETED->name],
                ],
            ])
            ->assertJsonCount(0, 'data.pool.activities.data');
    }
}
