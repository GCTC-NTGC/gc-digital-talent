<?php

namespace Tests\Feature\Generators;

use App\Generators\NominationsExcelGenerator;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\TalentNominationEvent;
use App\Models\TalentNominationGroup;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertTrue;

class NominationsExcelGeneratorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([
            RolePermissionSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
        ]);
    }

    // test that a file can be generated
    public function testCanGenerateFile(): void
    {
        // arrange
        $community = Community::factory()->withWorkStreams()->create();

        $talentCoordinator = User::factory()
            ->withGovEmployeeProfile()
            ->asCommunityTalentCoordinator($community->id)
            ->create();

        $employee1 = User::factory()->withGovEmployeeProfile()->create();
        CommunityInterest::factory()->create([
            'user_id' => $employee1->id,
            'community_id' => $community->id,
            'consent_to_share_profile' => true,
        ]);

        $employee2 = User::factory()->withGovEmployeeProfile()->create();
        CommunityInterest::factory()->create([
            'user_id' => $employee2->id,
            'community_id' => $community->id,
            'consent_to_share_profile' => false,
        ]);

        $talentNominationEvent = TalentNominationEvent::factory()->create([
            'community_id' => $community->id,
        ]);
        $nominationGroup1 = TalentNominationGroup::factory()->create([
            'nominee_id' => $employee1,
            'talent_nomination_event_id' => $talentNominationEvent->id,
        ]);
        $nominationGroup2 = TalentNominationGroup::factory()->create([
            'nominee_id' => $employee2,
            'talent_nomination_event_id' => $talentNominationEvent->id,
        ]);

        // act
        $fileName = sprintf('%s_%s', __('filename.users'), date('Y-m-d_His'));
        $generator = new NominationsExcelGenerator(
            fileName: $fileName,
            talentNominationEventId: $talentNominationEvent->id,
            dir: 'test',
            lang: 'en'
        );

        $generator
            ->setAuthenticatedUserId($talentCoordinator->id)
            ->setIds([$nominationGroup1->id, $nominationGroup2->id]);

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
