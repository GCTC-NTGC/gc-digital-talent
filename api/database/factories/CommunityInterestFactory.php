<?php

namespace Database\Factories;

use App\Enums\CommunityInterestAdditionalDuty;
use App\Enums\CommunityReferralStatus;
use App\Enums\DevelopmentProgramParticipationStatus;
use App\Enums\FinanceChiefRole;
use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\DevelopmentProgramUser;
use App\Models\EducationExperience;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CommunityInterest>
 */
class CommunityInterestFactory extends BaseFactory
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
            'additional_duties' => fn ($attributes) => ($attributes['finance_is_chief'] === true || $attributes['procurement_is_sdo'] === true)
                ? $this->faker->randomElements(array_column(CommunityInterestAdditionalDuty::cases(), 'name'), $this->faker->numberBetween(0, count(CommunityInterestAdditionalDuty::cases())))
                : [],
            'finance_other_roles' => fn ($attributes) => $attributes['finance_is_chief'] === true
                ? $this->faker->randomElements(array_column(FinanceChiefRole::cases(), 'name'), $this->faker->numberBetween(0, count(FinanceChiefRole::cases())))
                : [],
            'finance_other_roles_other' => fn ($attributes) => in_array(FinanceChiefRole::OTHER->name, $attributes['finance_other_roles'])
                ? $this->faker->jobTitle()
                : null,
            'consent_to_share_profile' => $this->faker->boolean(90),
            'procurement_is_sdo' => fn ($attributes) => Community::find($attributes['community_id'])->key === 'procurement'
                ? $this->faker->boolean()
                : null,
            'referral_status' => CommunityReferralStatus::NEW->name,
        ];
    }

    /**
     * Control consent to share profile
     */
    public function consented(bool $consent = true): self
    {
        return $this->state(fn () => [
            'consent_to_share_profile' => $consent,
        ]);
    }

    public function pendingReferral(?Carbon $followUpDate = null): self
    {
        $followUpDate = $followUpDate ?? $this->faker->dateTimeBetween('-1 month', '+3 months');

        return $this->state(fn () => [
            'referral_status' => CommunityReferralStatus::PENDING->name,
            'referral_classification_id' => null,
            'referral_follow_up_date' => $followUpDate,
            'referral_status_data_updated_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    public function availableForReferral(?string $classificationId = null, ?Carbon $followUpDate = null): self
    {
        $followUpDate = $followUpDate ?? $this->faker->dateTimeBetween('-1 month', '+3 months');
        $classificationId = $classificationId ?? $this->firstOrCreate(Classification::class)->id;

        return $this->state(fn () => [
            'referral_status' => CommunityReferralStatus::AVAILABLE_FOR_REFERRAL->name,
            'referral_classification_id' => $classificationId,
            'referral_follow_up_date' => $followUpDate,
            'referral_status_data_updated_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    public function notReferred(?string $notes = null): self
    {
        $notes = $notes ?? $this->faker->paragraph();

        return $this->state(fn () => [
            'referral_status' => CommunityReferralStatus::NOT_REFERRED->name,
            'referral_classification_id' => null,
            'referral_follow_up_date' => null,
            'referral_notes' => $notes,
            'referral_status_data_updated_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    public function withRandomReferralStatus(): self
    {
        return match ($this->faker->randomElement(CommunityReferralStatus::cases())) {
            CommunityReferralStatus::PENDING => $this->pendingReferral(),
            CommunityReferralStatus::AVAILABLE_FOR_REFERRAL => $this->availableForReferral(),
            CommunityReferralStatus::NOT_REFERRED => $this->notReferred(),
            CommunityReferralStatus::NEW => $this,
        };
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
            $associatedDevelopmentPrograms = $communityInterest->community->developmentProgramsThroughPivot()->limit($limit)->get();

            foreach ($associatedDevelopmentPrograms as $developmentProgram) {
                $participationValue = $this->faker
                    ->optional()
                    ->randomElement(array_column(DevelopmentProgramParticipationStatus::cases(), 'name'));

                DevelopmentProgramUser::create([
                    'development_program_id' => $developmentProgram->id,
                    'user_id' => $communityInterest->user_id,
                    'education_experience_id' => $this->faker->boolean() ?
                        EducationExperience::factory()->create(['user_id' => $communityInterest->user_id])->id
                        : null,
                    'participation_status' => $participationValue,
                    'completion_date' => $participationValue === DevelopmentProgramParticipationStatus::COMPLETED->name
                            ? $this->faker->dateTimeBetween('-1 year', 'now')
                            : null,
                ]);
            }
        });
    }
}
