<?php

namespace Database\Seeders;

use App\Enums\PoolStream;
use App\Enums\PublishingGroup;
use App\Models\Classification;
use App\Models\Pool;
use App\Models\Team;
use Faker\Generator;
use Illuminate\Container\Container;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PoolSeederRandom extends Seeder
{
    /**
     * The current Faker instance.
     *
     * @var \Faker\Generator
     */
    protected $faker;

    /**
     * Create a new seeder instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->faker = Container::getInstance()->make(Generator::class);
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Seed random pools
        Pool::factory()->count(2)->draft()->create();
        Pool::factory()->count(6)->published()->withAssessments()->create();
        Pool::factory()->count(2)->closed()->create();
        Pool::factory()->count(2)->archived()->create();
        // Seed some expected values
        $this->seedPools();
    }

    private function seedPools()
    {
        $publishingGroups = [
            PublishingGroup::IT_JOBS->name,
            PublishingGroup::IT_JOBS_ONGOING->name,
        ];
        $dates = [
            'FAR_PAST' => Carbon::create(1992, 10, 24),
            'FAR_FUTURE' => Carbon::create(2999, 10, 24),
        ];

        $classifications = Classification::where('group', 'IT')
            ->where('level', '<', 5)
            ->get();

        $testTeamId = Team::where('name', 'digital-community-management')->sole()['id'];

        foreach ($classifications as $classification) {
            foreach ($publishingGroups as $publishingGroup) {
                foreach ($dates as $date) {
                    Pool::factory()->published()->afterCreating(function ($pool) use ($classification) {
                        $pool->classifications()->sync([$classification->id]);
                    })->create([
                        'closing_date' => $date,
                        'publishing_group' => $publishingGroup,
                        'published_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
                        'stream' => $this->faker->randomElement(PoolStream::cases())->name,
                        'team_id' => $testTeamId,
                    ]);
                }
            }
        }
    }
}
