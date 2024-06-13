<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Team;
use App\Models\User;
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
        $description = $this->faker->sentence();

        return [
            'name' => $this->faker->unique()->word(),
            'display_name' => ['en' => $name.' EN', 'fr' => $name.' FR'],
            'description' => ['en' => $description.' EN', 'fr' => $description.' FR'],
            'contact_email' => $this->faker->email(),
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
