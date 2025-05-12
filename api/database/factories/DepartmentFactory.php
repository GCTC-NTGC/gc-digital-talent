<?php

namespace Database\Factories;

use App\Enums\DepartmentSize;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepartmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Department::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;

        return [
            'name' => ['en' => $faker->name, 'fr' => $faker->name],
            'department_number' => $faker->randomNumber(5, true),
            'org_identifier' => $faker->randomNumber(5, true),
            'size' => $this->faker->randomElement(DepartmentSize::cases())->name,
            'is_core_public_administration' => $this->faker->boolean(),
            'is_central_agency' => $this->faker->boolean(),
            'is_science' => $this->faker->boolean(),
            'is_regulatory' => $this->faker->boolean(),
        ];
    }
}
