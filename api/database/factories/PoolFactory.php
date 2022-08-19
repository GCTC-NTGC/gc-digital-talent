<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\Pool;
use App\Models\Skill;
use App\Models\User;
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
        $name = $this->faker->unique()->company();
        $isRemote = $this->faker->boolean();
        return [
            'name' => ['en' => $name, 'fr' => $name],
            'key' => KeyStringHelpers::toKeyString($name),
            'description' => ['en' => $this->faker->paragraph(), 'fr' => $this->faker->paragraph()],
            'user_id' => User::factory(),
            'operational_requirements' => $this->faker->optional->randomElements(ApiEnums::operationalRequirements(), 2),
            'key_tasks' => ['en' => $this->faker->paragraph() . ' EN', 'fr' => $this->faker->paragraph() . ' FR'],
            'your_impact' => ['en' => $this->faker->paragraph() . ' EN', 'fr' => $this->faker->paragraph() . ' FR'],
            'pool_status' => $this->faker->randomElement(ApiEnums::poolStatuses()),
            'is_published' => $this->faker->boolean(),
            'expiry_date' => $this->faker->dateTimeBetween('-1 months', '1 months', 'America/Vancouver'),
            'security_clearance' => $this->faker->randomElement(ApiEnums::poolAdvertisementSecurity()),
            'advertisement_language' => $this->faker->randomElement(ApiEnums::poolAdvertisementLanguages()),
            'advertisement_location' => !$isRemote ? ['en' => $this->faker->country(), 'fr' => $this->faker->country()] : null,
            'is_remote' => $isRemote
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Pool $pool) {
            $assets = CmoAsset::inRandomOrder()->limit(4)->get();
            $classifications = Classification::inRandomOrder()->limit(1)->get();
            $skills = Skill::inRandomOrder()->limit(10)->get();
            $pool->essentialCriteria()->saveMany($assets->slice(0, 2));
            $pool->assetCriteria()->saveMany($assets->slice(2, 2));
            $pool->classifications()->saveMany($classifications);
            $pool->essentialSkills()->saveMany($skills->slice(0, 5));
            $pool->nonessentialSkills()->saveMany($skills->slice(5, 5));
        });
    }
}
