<?php

namespace Database\Factories;

use App\Enums\TalentRequestTrackedUserNotReferredReason;
use App\Enums\TalentRequestTrackedUserNotSelectedReason;
use App\Enums\TalentRequestTrackedUserReferralDecision;
use App\Enums\TalentRequestTrackedUserSelectionDecision;
use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use Illuminate\Support\Arr;
use ReflectionClass;
use ReflectionMethod;

/**
 * @extends BaseFactory<TalentRequestTrackedUser>
 */
class TalentRequestTrackedUserFactory extends BaseFactory
{
    protected $model = TalentRequestTrackedUser::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => fn () => User::factory(),
            'talent_request_id' => fn () => TalentRequest::factory(),
            'referral_decision' => null,
            'selection_decision' => null,
            'not_referred_reason' => null,
            'not_selected_reason' => null,
        ];
    }

    public function referred(): self
    {
        return $this->state(fn () => [
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'not_referred_reason' => null,
        ]);
    }

    public function notReferred(?TalentRequestTrackedUserNotReferredReason $reason = null): self
    {
        $reason = $reason?->name ?? $this->faker->enum(TalentRequestTrackedUserNotReferredReason::class);

        return $this->state(fn () => [
            'referral_decision' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
            'not_referred_reason' => $reason,
            'selection_decision' => null,
            'not_selected_reason' => null,
        ]);
    }

    public function selected(): self
    {
        return $this->referred()->state(fn () => [
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::SELECTED->name,
            'not_selected_reason' => null,
        ]);
    }

    public function notSelected(?TalentRequestTrackedUserNotSelectedReason $reason = null): self
    {
        $reason = $reason?->name ?? $this->faker->enum(TalentRequestTrackedUserNotSelectedReason::class);

        return $this->referred()->state(fn () => [
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
            'not_selected_reason' => $reason,
        ]);
    }

    public function withRandomState(): static
    {
        $reflection = new ReflectionClass($this);
        $methods = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);
        $stateMethods = [];

        foreach ($methods as $method) {
            if ($method->class === self::class && ! in_array($method->name, ['definition', 'configure', 'withRandomState'])) {
                $stateMethods[] = $method->name;
            }
        }

        if (! empty($stateMethods)) {
            $randomMethod = Arr::random($stateMethods);

            return $this->$randomMethod();
        }

        return $this;
    }
}
