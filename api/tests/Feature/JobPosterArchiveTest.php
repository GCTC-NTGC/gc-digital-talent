<?php

namespace Tests\Feature;

use App\Console\Commands\ArchiveClosedJobPosters;
use App\Enums\JobPosterArchiveType;
use App\Models\Community;
use App\Models\JobPosterArchive;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class JobPosterArchiveTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $user;

    protected Pool $pool;

    protected string $query = <<<'GRAPHQL'
        query JobPosterArchiveTest($id: UUID!, $type: JobPosterArchiveType) {
            pool(id: $id) {
                archives(type: $type) {
                    type
                    html { en fr }
                }
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->user = User::factory()->asApplicant()->create();

        $this->pool = Pool::factory()->closed()->create();
    }

    public function testRetrieveAllArchives()
    {
        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
            ])
            ->assertJsonFragment(['type' => JobPosterArchiveType::PUBLISHED->name])
            ->assertJsonFragment(['type' => JobPosterArchiveType::CLOSED->name])
            ->assertJsonCount(2, 'data.pool.archives');
    }

    public function testCanFilterByType()
    {
        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
                'type' => JobPosterArchiveType::PUBLISHED->name,
            ])
            ->assertJsonFragment(['type' => JobPosterArchiveType::PUBLISHED->name])
            ->assertJsonMissing(['type' => JobPosterArchiveType::CLOSED->name])
            ->assertJsonCount(1, 'data.pool.archives');

        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
                'type' => JobPosterArchiveType::CLOSED->name,
            ])
            ->assertJsonMissing(['type' => JobPosterArchiveType::PUBLISHED->name])
            ->assertJsonFragment(['type' => JobPosterArchiveType::CLOSED->name])
            ->assertJsonCount(1, 'data.pool.archives');
    }

    public function testRetrievesHtml()
    {
        $expected = [
            'en' => $this->pool->toJobPosterHtml('en'),
            'fr' => $this->pool->toJobPosterHtml('fr'),
        ];

        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
            ])->assertJsonFragment([
                'type' => JobPosterArchiveType::CLOSED->name,
                'html' => $expected,
            ]);
    }

    public function testPublishStoresPublishedArchive()
    {
        $community = Community::factory()->create();

        $pool = Pool::factory()
            ->draft()
            ->for($community)
            ->withPoolSkills()
            ->withAssessmentSteps()
            ->create(['closing_date' => config('constants.far_future_datetime')]);

        $communityAdmin = User::factory()
            ->asCommunityAdmin($community->id)
            ->create(['sub' => 'community-admin@test.com']);

        $this->actingAs($communityAdmin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation PublishPool($id: ID!) {
                    publishPool(id: $id) {
                        id
                    }
                }
            GRAPHQL,
                ['id' => $pool->id])
            ->assertJson([
                'data' => [
                    'publishPool' => ['id' => $pool->id],
                ],
            ]);

        $archive = $pool->jobPosterArchives()->sole();
        $published = Pool::with(JobPosterArchive::$generationEagerLoads)->find($pool->id);

        $this->assertEquals(JobPosterArchiveType::PUBLISHED->name, $archive->type);
        $this->assertEquals($published->toJobPosterHtml('en'), $archive->html['en']);
        $this->assertEquals($published->toJobPosterHtml('fr'), $archive->html['fr']);
    }

    public function testCommandIsScheduledDailyAtThree()
    {
        $events = collect(app(Schedule::class)->events())
            ->filter(fn ($event) => str_contains($event->command ?? '', 'app:archive-closed-job-posters'));

        $this->assertEquals(1, $events->count());
        $this->assertEquals('0 3 * * *', $events->first()->expression);
        $this->assertEquals('America/Toronto', (string) $events->first()->timezone);
    }

    public function testCommandStoresArchiveForClosedPool()
    {
        $pool = Pool::factory()->published()->create();
        $pool->update(['closing_date' => now()->subDay()]);

        Artisan::call(ArchiveClosedJobPosters::class);

        $archive = $pool->jobPosterArchives()
            ->where('type', JobPosterArchiveType::CLOSED->name)
            ->sole();

        $this->assertEquals($pool->toJobPosterHtml('en'), $archive->html['en']);
        $this->assertEquals($pool->toJobPosterHtml('fr'), $archive->html['fr']);
    }

    public function testCommandDoesNotStoreSecondArchiveForClosedPool()
    {
        $existingId = $this->pool->jobPosterArchives()
            ->where('type', JobPosterArchiveType::CLOSED->name)
            ->sole()
            ->id;

        Artisan::call(ArchiveClosedJobPosters::class);

        $this->assertEquals($existingId, $this->pool->jobPosterArchives()
            ->where('type', JobPosterArchiveType::CLOSED->name)
            ->sole()
            ->id);
    }

    public function testCommandDoesNotStoreArchiveForOpenPool()
    {
        $pool = Pool::factory()->published()->create();

        Artisan::call(ArchiveClosedJobPosters::class);

        $this->assertEquals(0, $pool->jobPosterArchives()
            ->where('type', JobPosterArchiveType::CLOSED->name)
            ->count());
    }

    public function testCommandDoesNotStoreArchiveForDraftPool()
    {
        $pool = Pool::factory()->draft()->withPoolSkills()->create();

        Artisan::call(ArchiveClosedJobPosters::class);

        $this->assertEquals(0, $pool->jobPosterArchives()->count());
    }
}
