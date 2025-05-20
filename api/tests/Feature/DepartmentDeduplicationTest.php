<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;

class DepartmentDeduplicationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function testArtisanCommand(): void
    {
        // use first department in department map
        $departmentToKeep = Department::factory()->create(['department_number' => 903]);
        $departmentToRemove = Department::factory()->create(['department_number' => 199]);

        // records to touch
        $user = User::factory()->create();
        $user->computed_department = $departmentToRemove->id;
        $user->saveQuietly();
        $pool = Pool::factory()
            ->published()
            ->create(['department_id' => $departmentToRemove->id]);
        $poolCandidate = PoolCandidate::factory()
            ->availableInSearch()
            ->create([
                'placed_department_id' => $departmentToRemove->id,
                'pool_id' => $pool->id,
            ]);

        assertEquals(count(Department::all()), 2);

        // run command and assert output logged
        $this->artisan('app:department-deduplication')
            ->expectsOutputToContain('Department name: Accessibility Standards Canada')
            ->expectsOutputToContain('Replacing department 199 with department 903')
            ->expectsOutputToContain('Records touched: 3')
            ->expectsOutputToContain('Department 199 deleted');

        assertEquals(Department::sole()->id, $departmentToKeep->id);

        $user->refresh();
        $pool->refresh();
        $poolCandidate->refresh();

        // assert records were updated
        assertEquals($departmentToKeep->id, $user->computed_department);
        assertEquals($departmentToKeep->id, $pool->department_id);
        assertEquals($departmentToKeep->id, $poolCandidate->placed_department_id);
    }
}
