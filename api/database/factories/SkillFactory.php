<?php

namespace Database\Factories;

use App\Models\Skill;
use Database\Helpers\KeyStringHelpers;
use Illuminate\Database\Eloquent\Factories\Factory;

class SkillFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Skill::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $keywords =  $this->faker->words($nb = 3, $asText = false);
        $keywordsEN = [];
        $keywordsFR = [];
        foreach ($keywords as $index => $value) {
            $keywordsEN[$index] = $value . ' EN';
            $keywordsFR[$index] = $value . ' FR';
        }

        $name = $this->faker->unique()->jobTitle();
        return [
            'name' => ['en' => $name . ' EN', 'fr' => $name . ' FR'],
            'key' => KeyStringHelpers::toKeyString($name),
            'description' => ['en' => $this->faker->paragraph() . ' EN', 'fr' => $this->faker->paragraph() . ' FR'],
            'keywords' => ['en' => $keywordsEN, 'fr' => $keywordsFR],
        ];
    }

    public function configure()
    {
        return $this;
    }
}
