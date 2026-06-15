<?php

namespace Database\Factories;

use App\Models\Announcement;

class AnnouncementFactory extends BaseFactory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Announcement::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $publishDate = $this->faker->dateTimeBetween('2025-03-15', '2026-03-15');

        return [
            'key' => $this->faker->slug(),
            'title' => $this->faker->localizedString(),
            'message' => $this->faker->localizedString(null, 'paragraph'),
            'is_enabled' => $this->faker->boolean(),
            'is_dismissible' => $this->faker->boolean(),
            'publish_date' => $publishDate,
            'expiry_date' => $this->faker->dateTimeBetween($publishDate, '+1 month'),
        ];
    }

    public function sitewide(): self
    {
        return $this->state(function () {
            return ['key' => 'sitewide_announcement'];
        });
    }
}
