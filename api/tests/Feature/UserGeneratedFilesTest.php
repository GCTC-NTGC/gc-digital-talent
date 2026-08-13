<?php

namespace Tests\Feature;

use App\Models\Classification;
use App\Models\JobPosterTemplate;
use App\Models\User;
use App\Models\WorkStream;
use App\Support\FilePath;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesUnprotectedGraphqlEndpoint;

class UserGeneratedFilesTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesUnprotectedGraphqlEndpoint;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        Storage::fake(FilePath::GUARDED_DISK);
        Storage::fake(FilePath::PUBLIC_DISK);

        $this->user = User::factory()->create();
    }

    public function testPublicFileIsStreamedWithoutAuthentication(): void
    {
        Storage::disk(FilePath::PUBLIC_DISK)->put('template.docx', 'template contents');

        $response = $this->getJson('/api/user-generated-files/'.FilePath::PUBLIC_PATH.'/template.docx');

        $response->assertOk();
        $response->assertHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
        $this->assertSame('template contents', $response->streamedContent());
    }

    public function testAbsentPublicFileIsNotFound(): void
    {
        $response = $this->getJson('/api/user-generated-files/'.FilePath::PUBLIC_PATH.'/absent.docx');

        $response->assertNotFound();
    }

    public function testPublicRouteDoesNotStreamFilesFromTheGuardedDisk(): void
    {
        Storage::disk(FilePath::GUARDED_DISK)->put('report.docx', 'report contents');
        Storage::disk(FilePath::GUARDED_DISK)->put($this->user->id.'/report.docx', 'report contents');

        $response = $this->getJson('/api/user-generated-files/'.FilePath::PUBLIC_PATH.'/report.docx');

        $response->assertNotFound();
    }

    public function testGuardedFileRejectsUnauthenticatedRequest(): void
    {
        Storage::disk(FilePath::GUARDED_DISK)->put($this->user->id.'/report.docx', 'report contents');

        $response = $this->getJson('/api/user-generated-files/report.docx');

        $response->assertUnauthorized();
    }

    public function testGuardedFileIsStreamedFromAuthenticatedUserDirectory(): void
    {
        Storage::disk(FilePath::GUARDED_DISK)->put($this->user->id.'/report.docx', 'report contents');

        $response = $this->actingAs($this->user, 'api')
            ->getJson('/api/user-generated-files/report.docx');

        $response->assertOk();
        $this->assertSame('report contents', $response->streamedContent());
    }

    public function testGuardedRouteDoesNotStreamFilesFromThePublicDisk(): void
    {
        Storage::disk(FilePath::PUBLIC_DISK)->put('template.docx', 'template contents');

        $response = $this->actingAs($this->user, 'api')
            ->getJson('/api/user-generated-files/template.docx');

        $response->assertNotFound();
    }

    public function testUnauthenticatedUserCanGenerateAndDownloadAJobPosterTemplate(): void
    {
        Classification::factory()->create();
        WorkStream::factory()->create();
        $template = JobPosterTemplate::factory()->withSkills()->create();

        $mutation = $this->graphQL(
            /** @lang GraphQL */
            'mutation Download($id: UUID!) {
                downloadJobPosterTemplateDoc(id: $id)
            }',
            ['id' => $template->id]
        );

        $fileName = $mutation->json('data.downloadJobPosterTemplateDoc');
        $this->assertIsString($fileName);
        Storage::disk(FilePath::PUBLIC_DISK)->assertExists($fileName);

        $download = $this->getJson('/api/user-generated-files/'.FilePath::PUBLIC_PATH.'/'.$fileName);

        $download->assertOk();
    }

    public function testPublicFileWithAnApostropheIsStreamed(): void
    {
        $fileName = 'Modèle d’offre d’emploi.docx';
        Storage::disk(FilePath::PUBLIC_DISK)->put($fileName, 'template contents');

        $response = $this->getJson('/api/user-generated-files/'.FilePath::PUBLIC_PATH.'/'.$fileName);

        $response->assertOk();
        $this->assertSame('template contents', $response->streamedContent());
    }
}
