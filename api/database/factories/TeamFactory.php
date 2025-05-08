<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeamFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Team::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->company();

        return [
            'name' => $this->faker->unique()->word(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Team $team) {
            $departments = Department::inRandomOrder()->limit(2)->get();
            $team->departments()->saveMany($departments);
        });
    }
}
