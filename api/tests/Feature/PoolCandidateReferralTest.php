<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Models\PoolCandidate;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PoolCandidateReferralTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    #[DataProvider('referralStatusProvider')]
    public function testIsBeingReferredLogic(
        string $status,
        ?Carbon $pauseAt,
        ?Carbon $resumeAt,
        ?bool $expected
    ) {
        $candidate = PoolCandidate::factory()->create([
            'application_status' => $status,
            'pause_referrals_at' => $pauseAt,
            'resume_referrals_at' => $resumeAt,
        ]);

        $this->assertSame($expected, $candidate->is_being_referred);
    }

    public static function referralStatusProvider(): array
    {
        return [
            'Not qualified returns null' => [
                ApplicationStatus::TO_ASSESS->name, null, null, null,
            ],
            'Qualified with no pause returns true' => [
                ApplicationStatus::QUALIFIED->name, null, null, true,
            ],
            'Currently in active pause returns false' => [
                ApplicationStatus::QUALIFIED->name, Carbon::now()->subDay(), Carbon::now()->addDay(), false,
            ],
            'Indefinite pause returns false' => [
                ApplicationStatus::QUALIFIED->name, Carbon::now()->subDay(), null, false,
            ],
            'Future pause returns true' => [
                ApplicationStatus::QUALIFIED->name, Carbon::now()->addWeek(), null, true,
            ],
            'Expired pause (already resumed) returns true' => [
                ApplicationStatus::QUALIFIED->name, Carbon::now()->subMonth(), Carbon::now()->subDay(), true,
            ],
        ];
    }
}
