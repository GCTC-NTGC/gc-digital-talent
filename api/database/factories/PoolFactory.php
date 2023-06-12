<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\Pool;
use App\Models\Skill;
use App\Models\User;
use App\Models\Team;
use App\Models\ScreeningQuestion;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;
use Database\Helpers\KeyStringHelpers;
use Database\Helpers\ApiEnums;

class PoolFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Pool::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $adminUserId = User::whereHas('roles', function (Builder $query) {
            $query->where('name', 'platform_admin');
        })->limit(1)
            ->pluck('id')
            ->first();
        if (is_null($adminUserId))
            $adminUserId = User::factory()->asAdmin()->create()->id;

        $teamId = Team::inRandomOrder()
            ->limit(1)
            ->pluck('id')
            ->first();
        if (is_null($teamId))
            $teamId = Team::factory()->create()->id;

        $name = $this->faker->unique()->company();
        // this is essentially the draft state
        return [
            'name' => ['en' => $name, 'fr' => $name],
            'key' => KeyStringHelpers::toKeyString($name),
            'user_id' => $adminUserId,
            'team_id' => $teamId,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Pool $pool) {
            $classifications = Classification::inRandomOrder()->limit(1)->get();
            $skills = Skill::inRandomOrder()->limit(10)->get();
            $pool->classifications()->saveMany($classifications);
            $pool->essentialSkills()->saveMany($skills->slice(0, 5));
            $pool->nonessentialSkills()->saveMany($skills->slice(5, 5));

            ScreeningQuestion::factory()
                ->count(3)
                ->sequence(
                    ['sort_order' => 1],
                    ['sort_order' => 2],
                    ['sort_order' => 3],
                )
                ->create(['pool_id' => $pool->id]);
        });
    }

    /**
     * Indicate that the pool is draft.
     */
    public function draft(): Factory
    {
        return $this->state(function (array $attributes) {
            // the base state is draft already
            return [];
        });
    }

    /**
     * Indicate that the pool is published.
     */
    public function published(): Factory
    {
        return $this->state(function (array $attributes) {
            $isRemote = $this->faker->boolean();

            return [
                // published in the past, closes in the future
                'published_at' => $this->faker->dateTimeBetween('-30 days', '-1 days'),

                'operational_requirements' => $this->faker->randomElements(ApiEnums::operationalRequirements(), 2),
                'key_tasks' => ['en' => $this->faker->paragraph() . ' EN', 'fr' => $this->faker->paragraph() . ' FR'],
                'your_impact' => ['en' => $this->faker->paragraph() . ' EN', 'fr' => $this->faker->paragraph() . ' FR'],
                'security_clearance' => $this->faker->randomElement(ApiEnums::poolSecurity()),
                'advertisement_language' => $this->faker->randomElement(ApiEnums::poolLanguages()),
                'advertisement_location' => !$isRemote ? ['en' => $this->faker->country(), 'fr' => $this->faker->country()] : null,
                'is_remote' => $isRemote,
                'stream' => $this->faker->randomElement(ApiEnums::poolStreams()),
                'process_number' => $this->faker->word(),
                'publishing_group' => $this->faker->randomElement(ApiEnums::publishingGroups())
            ];
        });
    }

    /**
     * Indicate that the pool is closed.
     */
    public function closed(): Factory
    {
        return $this->published()->state(function (array $attributes) {
            return [
                'published_at' => $this->faker->dateTimeBetween('-6 months', '-2 months'),
                'closing_date' => $this->faker->dateTimeBetween('-1 months', '-1 day'),
            ];
        });
    }
}
