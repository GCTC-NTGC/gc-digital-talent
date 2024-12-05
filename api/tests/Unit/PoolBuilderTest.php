<?php

namespace Tests\Unit;

use App\Models\Pool;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Throwable;

use function PHPUnit\Framework\assertEquals;

class PoolBuilderTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function testOrderByColumnSortsDescWithNullsLast()
    {
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000001',
            'published_at' => null,
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000002',
            'published_at' => '2020-01-01',
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000003',
            'published_at' => '2021-01-01',
        ]);

        $sorted = Pool::orderByColumn([
            'column' => 'published_at',
            'order' => 'DESC',
            'nulls' => 'ORDER_LAST',
        ])->get(['id'])->pluck('id')->toArray();

        assertEquals($sorted, [
            '00000000-0000-0000-0000-000000000003',
            '00000000-0000-0000-0000-000000000002',
            '00000000-0000-0000-0000-000000000001', // null forced last
        ]);
    }

    public function testOrderByColumnSortsDescWithNullsDefault()
    {
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000003',
            'published_at' => '2021-01-01',
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000002',
            'published_at' => '2020-01-01',
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000001',
            'published_at' => null,
        ]);

        $sorted = Pool::orderByColumn([
            'column' => 'published_at',
            'order' => 'DESC',
        ])->get(['id'])->pluck('id')->toArray();

        assertEquals($sorted, [
            '00000000-0000-0000-0000-000000000001', // null first by default, for DESC
            '00000000-0000-0000-0000-000000000003',
            '00000000-0000-0000-0000-000000000002',
        ]);
    }

    public function testOrderByColumnSortsAscWithNullsFirst()
    {
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000003',
            'published_at' => '2021-01-01',
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000002',
            'published_at' => '2020-01-01',
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000001',
            'published_at' => null,
        ]);

        $sorted = Pool::orderByColumn([
            'column' => 'published_at',
            'order' => 'ASC',
            'nulls' => 'ORDER_FIRST',
        ])->get(['id'])->pluck('id')->toArray();

        assertEquals($sorted, [
            '00000000-0000-0000-0000-000000000001', // null forced first
            '00000000-0000-0000-0000-000000000002',
            '00000000-0000-0000-0000-000000000003',
        ]);
    }

    public function testOrderByColumnRejectsBadColumn()
    {
        try {
            Pool::orderByColumn([
                'column' => 'bad_column',
                'order' => 'ASC',
            ]);
        } catch (Throwable $e) {
            assertEquals('Invalid column', $e->getMessage());

            return;
        }
        $this->fail('Expected exception');
    }

    public function testOrderByColumnRejectsBadOrder()
    {
        try {
            Pool::orderByColumn([
                'column' => 'published_at',
                'order' => 'bad_order',
            ]);
        } catch (Throwable $e) {
            assertEquals('Invalid order option', $e->getMessage());

            return;
        }
        $this->fail('Expected exception');
    }

    public function testOrderByColumnRejectsBadNullsOption()
    {
        try {
            Pool::orderByColumn([
                'column' => 'published_at',
                'order' => 'ASC',
                'nulls' => 'bad_nulls',
            ]);
        } catch (Throwable $e) {
            assertEquals('Invalid nulls option', $e->getMessage());

            return;
        }
        $this->fail('Expected exception');
    }
}
