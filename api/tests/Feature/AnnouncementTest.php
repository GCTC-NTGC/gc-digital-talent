<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class AnnouncementTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $admin;

    protected $nonAdmin;

    protected Announcement $announcement;

    protected array $input = [
        'title' => ['en' => 'Title (en)', 'fr' => 'Title (fr)'],
        'message' => ['en' => 'Message (en)', 'fr' => 'Message (fr)'],
        'isEnabled' => true,
        'isDismissible' => false,
    ];

    protected $query = <<<'GRAPHQL'
        query {
            sitewideAnnouncement {
                title { en fr }
                message { en fr }
                isEnabled
                isDismissible
                publishDate
                expiryDate
                updatedAt
            }
        }
    GRAPHQL;

    protected $mutation = <<<'GRAPHQL'
        mutation UpdateSitewideAnnouncement($input: SitewideAnnouncementInput!) {
            updateSitewideAnnouncement(sitewideAnnouncementInput: $input) {
                title { en fr }
                message { en fr }
                isEnabled
                isDismissible
                publishDate
                expiryDate
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->nonAdmin = User::factory()->asApplicant()->create();
        $this->admin = User::factory()->asAdmin()->create();

        $this->announcement = Announcement::factory()->sitewide()->create([
            'title' => $this->input['title'],
            'message' => $this->input['message'],
            'is_enabled' => $this->input['isEnabled'],
            'is_dismissible' => $this->input['isDismissible'],
        ]);
    }

    public function testQueryReturnsNullWhenNoneExists(): void
    {
        Announcement::truncate();

        $this->graphQL($this->query)
            ->assertJson(['data' => ['sitewideAnnouncement' => null]]);
    }

    public function testQueryReturnsSitewideAnnouncement(): void
    {

        $this->graphQL($this->query)
            ->assertJson([
                'data' => [
                    'sitewideAnnouncement' => $this->input,
                ],
            ]);
    }

    public function testNonAdminCannotUpdate(): void
    {
        $this->actingAs($this->nonAdmin, 'api')
            ->graphQL($this->mutation, [
                'input' => [
                    ...$this->input,
                    'publishDate' => config('constants.past_datetime'),
                    'expiryDate' => config('constants.far_future_datetime'),
                ],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testAdminCanUpdate(): void
    {
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->mutation, [
                'input' => [
                    ...$this->input,
                    'publishDate' => config('constants.past_datetime'),
                    'expiryDate' => config('constants.far_future_datetime'),
                ],
            ])
            ->assertJsonFragment([
                'publishDate' => config('constants.past_datetime'),
                'expiryDate' => config('constants.far_future_datetime'),
            ]);
    }
}
