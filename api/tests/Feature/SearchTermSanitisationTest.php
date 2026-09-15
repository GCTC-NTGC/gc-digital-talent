<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\User;
use App\Utilities\PostgresLike;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * These run the scopes rather than checking a built string, so dropping the escaping
 * fails here.
 */
class SearchTermSanitisationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // the user factory attaches a role
        $this->seed(RolePermissionSeeder::class);
    }

    #[DataProvider('escapeProvider')]
    public function testItEscapesLikeMetacharacters(string $input, string $expected): void
    {
        $this->assertSame($expected, PostgresLike::escape($input));
    }

    public static function escapeProvider(): array
    {
        return [
            'percent' => ['50%', '50\%'],
            'underscore' => ['a_b', 'a\_b'],
            'backslash' => ['x\\y', 'x\\\\y'],
            'backslash before percent' => ['\\%', '\\\\\%'],
            'several' => ['100%_done', '100\%\_done'],
            'nothing to escape' => ['plain', 'plain'],
        ];
    }

    #[DataProvider('userScopeProvider')]
    public function testUserSearchTreatsWildcardsAsLiterals(string $scope): void
    {
        $literal = User::factory()->create([
            'first_name' => 'Ab50%X', 'last_name' => 'Ab50%X',
            'email' => 'ab50%x@test.test', 'work_email' => 'ab50%x@work.test',
            'telephone' => 'Ab50%X',
        ]);
        User::factory()->create([
            'first_name' => 'Ab50QQX', 'last_name' => 'Ab50QQX',
            'email' => 'ab50qqx@test.test', 'work_email' => 'ab50qqx@work.test',
            'telephone' => 'Ab50QQX',
        ]);

        $terms = [
            'whereName' => ['Ab50%X', 'Ab50'],
            'whereTelephone' => ['Ab50%X', 'Ab50'],
            'whereEmail' => ['ab50%x@test.test', 'ab50'],
            'whereWorkEmail' => ['ab50%x@work.test', 'ab50'],
        ];
        [$wildcardTerm, $sharedPrefix] = $terms[$scope];

        // only the row with a literal % should match
        $matched = User::query()->{$scope}($wildcardTerm)->pluck('id')->all();
        $this->assertSame([$literal->id], $matched);

        // control: a shared term still matches both rows
        $this->assertCount(2, User::query()->{$scope}($sharedPrefix)->get());
    }

    public static function userScopeProvider(): array
    {
        return [
            'whereName' => ['whereName'],
            'whereTelephone' => ['whereTelephone'],
            'whereEmail' => ['whereEmail'],
            'whereWorkEmail' => ['whereWorkEmail'],
        ];
    }

    public function testActivityPropertiesSearchTreatsWildcardsAsLiterals(): void
    {
        foreach (['{"attributes":{"notes":"first"}}', '{"attributes":{"notes":"second"}}'] as $properties) {
            DB::table('activity_log')->insert([
                'id' => Str::uuid()->toString(),
                'log_name' => 'default',
                'description' => 'updated',
                'properties' => $properties,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // unescaped, "%" would match every row
        $this->assertCount(0, Activity::query()->wherePropertiesLike('%')->get());
        // control: a real term still matches
        $this->assertCount(1, Activity::query()->wherePropertiesLike('second')->get());
    }

    public function testGeneralSearchReturnsNothingWhenTheTermSanitisesToNothing(): void
    {
        User::factory()->count(3)->create();

        // whitespace passes the empty() guard but sanitises away to nothing
        $this->assertCount(0, User::query()->whereGeneralSearch('   ')->get());
        $this->assertGreaterThan(0, User::query()->count());
    }
}
