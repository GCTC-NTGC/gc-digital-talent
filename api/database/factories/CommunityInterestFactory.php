<?php

namespace Database\Factories;

use App\Enums\FinanceChiefDuty;
use App\Enums\FinanceChiefRole;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\DevelopmentProgramInterest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CommunityInterest>
 */
class CommunityInterestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->firstOr(
                fn () => User::factory()->create()
            )->id,
            'community_id' => Community::inRandomOrder()->firstOr(
                fn () => Community::factory()->withWorkStreams()->create()
            )->id,
            'job_interest' => $this->faker->boolean(),
            'training_interest' => $this->faker->boolean(),
            'additional_information' => $this->faker->paragraph(),
            'finance_is_chief' => fn ($attributes) => Community::find($attributes['community_id'])->key === 'finance'
                ? $this->faker->boolean()
                : null,
            'finance_additional_duties' => fn ($attributes) => $attributes['finance_is_chief'] === true
                ? $this->faker->randomElements(array_column(FinanceChiefDuty::cases(), 'name'), $this->faker->numberBetween(0, count(FinanceChiefDuty::cases())))
                : [],
            'finance_other_roles' => fn ($attributes) => $attributes['finance_is_chief'] === true
                ? $this->faker->randomElements(array_column(FinanceChiefRole::cases(), 'name'), $this->faker->numberBetween(0, count(FinanceChiefRole::cases())))
                : [],
            'finance_other_roles_other' => fn ($attributes) => in_array(FinanceChiefRole::OTHER->name, $attributes['finance_other_roles'])
                ? $this->faker->jobTitle()
                : null,
            'consent_to_share_profile' => $this->faker->boolean(90),
        ];
    }

    /**
     * Create many work stream relationships
     */
    public function withWorkStreams(int $limit = 3)
    {
        $count = $this->faker->numberBetween(1, $limit);

        return $this->afterCreating(function (CommunityInterest $model) use ($count) {
            $workStreams = $model->community->workStreams()->limit($count)->get()->pluck('id');

            $model->workStreams()->attach($workStreams);
        });
    }

    /**
     * Create many development program relationships from the parent community
     */
    public function withDevelopmentProgramInterests(int $limit = 3)
    {
        return $this->afterCreating(function (CommunityInterest $communityInterest) use ($limit) {
            $communityDevelopmentPrograms = $communityInterest->community->communityDevelopmentPrograms()->limit($limit)->get();
            foreach ($communityDevelopmentPrograms as $communityDevelopmentProgram) {
                DevelopmentProgramInterest::factory()
                    ->create([
                        'community_development_program_id' => $communityDevelopmentProgram->id,
                        'community_interest_id' => $communityInterest->id,
                    ]);
            }
        });
    }
}
