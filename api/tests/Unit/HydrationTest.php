<?php

namespace Tests\Unit;

use App\Facades\Notify;
use App\Models\Experience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertEqualsCanonicalizing;

class HydrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
    }

    // older snapshots have raw enums in them unlike than the newer ones with the localized enums
    public function testHydrateRawEnums(): void
    {
        $string = <<<'JSON'
            [
                {
                    "id": "00000000-0000-0000-0000-000000000000",
                    "type": "CERTIFICATION",
                    "user": {
                        "id": "00000000-0000-0000-0000-000000000000",
                        "email": "user@example.org"
                    },
                    "skills": [],
                    "status": "SUCCESS_CREDENTIAL",
                    "details": "Itaque exercitationem ea in neque et eos laudantium. Qui natus placeat ipsa modi maiores eius rerum. Enim nostrum voluptatem ea explicabo.",
                    "endDate": "2018-03-01",
                    "startDate": "2018-01-01",
                    "__typename": "EducationExperience",
                    "areaOfStudy": "Teacher",
                    "institution": "ExitCertified",
                    "thesisTitle": null
                }
            ]
        JSON;
        $json = json_decode($string, true);

        $experiences = collect(Experience::hydrateSnapshot($json));
        assertEquals($experiences->sole()->type, 'CERTIFICATION');
        assertEquals($experiences->sole()->status, 'SUCCESS_CREDENTIAL');

    }

    // newer snapshots have localized enums in them unlike than the older ones with the raw enums
    public function testHydrateLocalizedEnums(): void
    {
        $string = <<<'JSON'
            [
                {
                    "id": "00000000-0000-0000-0000-000000000000",
                    "type": {
                        "label": {
                        "en": "Bachelor's Degree",
                        "fr": "Baccalauréat"
                        },
                        "value": "BACHELORS_DEGREE"
                    },
                    "skills": [],
                    "status": {
                        "label": {
                        "en": "Audited",
                        "fr": "Audité"
                        },
                        "value": "AUDITED"
                    },
                    "details": "Itaque exercitationem ea in neque et eos laudantium. Qui natus placeat ipsa modi maiores eius rerum. Enim nostrum voluptatem ea explicabo.",
                    "endDate": null,
                    "startDate": "2012-10-09",
                    "__typename": "EducationExperience",
                    "areaOfStudy": "Teacher",
                    "institution": "Sanford-Ernser",
                    "thesisTitle": "utilize intuitive architectures"
                }
            ]
        JSON;
        $json = json_decode($string, true);

        $experiences = collect(Experience::hydrateSnapshot($json));
        assertEquals($experiences->sole()->type, 'BACHELORS_DEGREE');
        assertEquals($experiences->sole()->status, 'AUDITED');
    }

    public function testHydrateUser(): void
    {
        $this->seed(ClassificationSeeder::class);
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);

        $pool = Pool::factory()->create();
        $userOrig = User::factory()->create();

        $candidate = PoolCandidate::factory()
            ->for($pool)
            ->for($userOrig)
            ->create();
        $candidate->setApplicationSnapshot();

        $userHyd = User::hydrateSnapshot($candidate->profile_snapshot);

        // plain strings
        assertEquals($userOrig->first_name, $userHyd->first_name);

        // single enum
        assertEquals($userOrig->armed_forces_status, $userHyd->armed_forces_status);

        // enum array
        assertEqualsCanonicalizing($userOrig->location_preferences, $userHyd->location_preferences);
    }
}
