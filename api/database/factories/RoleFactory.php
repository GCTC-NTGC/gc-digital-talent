<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Role::class;

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
            'display_name' => ['en' => $name . ' EN', 'fr' => $name . ' FR'],
            'description' => ['en' => $description . ' EN', 'fr' => $description . ' FR'],
            'is_team_based' => $this->faker->boolean(),
        ];
    }

    public function configure()
    {
        return $this;
    }
}
