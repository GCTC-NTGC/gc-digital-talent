<?php

namespace Database\Factories;

use App\Enums\PoolSkillType;
use App\Enums\PoolStream;
use App\Enums\SkillLevel;
use App\Enums\SupervisoryStatus;
use App\Models\Classification;
use App\Models\JobPosterTemplate;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobPosterTemplate>
 */
class JobPosterTemplateFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = JobPosterTemplate::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $classification = Classification::inRandomOrder()->first();
        if (! $classification) {
            $classification = Classification::factory()->create();
        }

        return [
            'supervisory_status' => $this->faker->randomElement(SupervisoryStatus::cases())->name,
            'stream' => $this->faker->randomElement(PoolStream::cases())->name,
            'reference_id' => implode('_', $this->faker->words()),
            'classification_id' => $classification->id,
            'name' => [
                'en' => $this->faker->jobTitle().' (EN)',
                'fr' => $this->faker->jobTitle().' (FR)',
            ],
            'description' => [
                'en' => $this->faker->paragraph().' (EN)',
                'fr' => $this->faker->paragraph().' (FR)',
            ],
            'tasks' => [
                'en' => $this->faker->paragraph().' (EN)',
                'fr' => $this->faker->paragraph().' (FR)',
            ],
            'keywords' => [
                'en' => $this->faker->words(),
                'fr' => $this->faker->words(),
            ],
            'work_description' => [
                'en' => $this->faker->url(),
                'fr' => $this->faker->url(),
            ],
            'essential_technical_skills_notes' => [
                'en' => $this->faker->paragraph().' (EN)',
                'fr' => $this->faker->paragraph().' (FR)',
            ],
            'essential_behavioural_skills_notes' => [
                'en' => $this->faker->paragraph().' (EN)',
                'fr' => $this->faker->paragraph().' (FR)',
            ],
            'nonessential_technical_skills_notes' => [
                'en' => $this->faker->paragraph().' (EN)',
                'fr' => $this->faker->paragraph().' (FR)',
            ],
        ];
    }

    public function withSkills($essentialCount = 3, $nonessentialCount = 3)
    {
        return $this->afterCreating(function (JobPosterTemplate $template) use ($essentialCount, $nonessentialCount) {
            $skills = Skill::inRandomOrder()->limit($essentialCount + $nonessentialCount)->get();
            $skills->each(function (Skill $skill, int $key) use ($essentialCount, $template) {
                $type = $essentialCount < $key ? PoolSkillType::ESSENTIAL->name : PoolSkillType::NONESSENTIAL->name;
                $template->skills()->attach($skill->id, [
                    'type' => $type,
                    'required_skill_level' => $this->faker->randomElement(array_column(SkillLevel::cases(), 'name')),
                ]);
            });
        });
    }
}
