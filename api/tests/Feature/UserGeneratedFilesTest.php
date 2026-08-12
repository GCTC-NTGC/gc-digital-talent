<?php

namespace Tests\Feature;

use App\Models\User;
use App\Support\FilePath;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UserGeneratedFilesTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        Storage::fake('user_generated');

        $this->user = User::factory()->create();
    }

    public function testPublicFileIsStreamedWithoutAuthentication(): void
    {
        Storage::disk('user_generated')
            ->put(FilePath::PUBLIC_PATH.'/template.docx', 'template contents');

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

    public function testGuardedFileRejectsUnauthenticatedRequest(): void
    {
        Storage::disk('user_generated')->put($this->user->id.'/report.docx', 'report contents');

        $response = $this->getJson('/api/user-generated-files/report.docx');

        $response->assertUnauthorized();
    }

    public function testGuardedFileIsStreamedFromAuthenticatedUserDirectory(): void
    {
        Storage::disk('user_generated')->put($this->user->id.'/report.docx', 'report contents');

        $response = $this->actingAs($this->user, 'api')
            ->getJson('/api/user-generated-files/report.docx');

        $response->assertOk();
        $this->assertSame('report contents', $response->streamedContent());
    }

    public function testGuardedFileDoesNotServeFilesFromAnotherDirectory(): void
    {
        Storage::disk('user_generated')
            ->put(FilePath::PUBLIC_PATH.'/template.docx', 'template contents');

        $response = $this->actingAs($this->user, 'api')
            ->getJson('/api/user-generated-files/template.docx');

        $response->assertNotFound();
    }
}
