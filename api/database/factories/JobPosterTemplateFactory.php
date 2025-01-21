<?php

namespace Database\Factories;

use App\Enums\PoolSkillType;
use App\Enums\PoolStream;
use App\Enums\SkillCategory;
use App\Enums\SkillLevel;
use App\Enums\SupervisoryStatus;
use App\Models\Classification;
use App\Models\JobPosterTemplate;
use App\Models\Skill;
use App\Models\WorkStream;
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

        $poolStream = $this->faker->randomElement(PoolStream::cases())->name;
        $workStream = WorkStream::where('key', $poolStream)->first();
        if (! $workStream) {
            $workStream = WorkStream::factory()->create();
        }

        $keyTasks = collect();
        for ($i = 0; $i < $this->faker->numberBetween(2, 10); $i++) {
            $keyTasks->add($this->faker->sentence());
        }
        $keyTasksHtmlEn = '<ul>'
            .$keyTasks->reduce(fn ($carry, $task) => $carry.'<li><p>'.$task.' (EN)</p></li>')
            .'</ul>';
        $keyTasksHtmlFr = '<ul>'
            .$keyTasks->reduce(fn ($carry, $task) => $carry.'<li><p>'.$task.' (FR)</p></li>')
            .'</ul>';

        return [
            'supervisory_status' => $this->faker->randomElement(SupervisoryStatus::cases())->name,
            'stream' => $poolStream,
            'work_stream_id' => $workStream->id,
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
                'en' => $keyTasksHtmlEn,
                'fr' => $keyTasksHtmlFr,
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

    public function withSkills($essentialTechnicalCount = 3, $essentialBehaviouralCount = 3, $nonessentialTechnicalCount = 3)
    {
        return $this->afterCreating(function (JobPosterTemplate $template) use ($essentialTechnicalCount, $essentialBehaviouralCount, $nonessentialTechnicalCount) {
            $essentialTechnicalSkills = Skill::where('category', SkillCategory::TECHNICAL->name)->inRandomOrder()->limit($essentialTechnicalCount)->get();
            $essentialTechnicalSkills->each(function (Skill $skill) use ($template) {
                $template->skills()->attach($skill->id, [
                    'type' => PoolSkillType::ESSENTIAL->name,
                    'required_skill_level' => $this->faker->randomElement(array_column(SkillLevel::cases(), 'name')),
                ]);
            });

            $essentialBehaviouralSkills = Skill::where('category', SkillCategory::BEHAVIOURAL->name)->inRandomOrder()->limit($essentialBehaviouralCount)->get();
            $essentialBehaviouralSkills->each(function (Skill $skill) use ($template) {
                $template->skills()->attach($skill->id, [
                    'type' => PoolSkillType::ESSENTIAL->name,
                    'required_skill_level' => $this->faker->randomElement(array_column(SkillLevel::cases(), 'name')),
                ]);
            });

            $nonessentialTechnicalSkills = Skill::where('category', SkillCategory::TECHNICAL->name)->inRandomOrder()->limit($nonessentialTechnicalCount)->get();
            $nonessentialTechnicalSkills->each(function (Skill $skill) use ($template) {
                $template->skills()->attach($skill->id, [
                    'type' => PoolSkillType::NONESSENTIAL->name,
                    'required_skill_level' => null,
                ]);
            });
        });
    }
}
