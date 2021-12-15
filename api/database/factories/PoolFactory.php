<?php

namespace Database\Factories;

use App\Models\Pool;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

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
        $name = $this->faker->company();
        return [
            'name' => ['en' => $name, 'fr' => $name],
            'key' => strtolower(preg_replace('/\s+/', '_', $name)),
            'description' => ['en' => $this->faker->paragraph(), 'fr' => $this->faker->paragraph()],
            'user_id' => User::factory(),
        ];
    }
}
