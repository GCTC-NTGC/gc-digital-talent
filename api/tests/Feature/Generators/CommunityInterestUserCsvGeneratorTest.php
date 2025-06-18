<?php

namespace Tests\Feature;

use App\Generators\CommunityInterestUserCsvGenerator;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertTrue;

class CommunityInterestUserCsvGeneratorTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    // test that a file can be generated
    public function testCanGenerateFile(): void
    {
        // arrange
        $community = Community::factory()->withWorkStreams()->create();

        $communityRecruiter = User::factory()
            ->asGovEmployee()
            ->asCommunityRecruiter($community->id)
            ->create();

        $employee1 = User::factory()->asGovEmployee()->create();
        $interest1 = CommunityInterest::factory()->create([
            'user_id' => $employee1->id,
            'community_id' => $community->id,
            'consent_to_share_profile' => true,
        ]);

        $employee2 = User::factory()->asGovEmployee()->create();
        $interest2 = CommunityInterest::factory()->create([
            'user_id' => $employee2->id,
            'community_id' => $community->id,
            'consent_to_share_profile' => true,
        ]);

        // act
        $fileName = sprintf('%s_%s', __('filename.users'), date('Y-m-d_His'));
        $generator = new CommunityInterestUserCsvGenerator(
            fileName: $fileName,
            dir: 'test',
            lang: 'en'
        );

        $generator
            ->setUserId($communityRecruiter->id)
            ->setIds([$interest1->id, $interest2->id])
            ->setFilters([]);

        $generator->generate()->write();

        // assert
        $disk = Storage::disk('userGenerated');
        $path = 'test'.DIRECTORY_SEPARATOR.$fileName.'.csv';

        $fileExists = $disk->exists($path);
        assertTrue($fileExists, 'File was not generated');
        $lineCount = count(file($disk->path($path)));
        assertEquals(3, $lineCount, 'The wrong number of lines are in the file');
    }
}
