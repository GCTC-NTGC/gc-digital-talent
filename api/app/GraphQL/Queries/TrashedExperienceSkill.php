<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ExperienceSkill;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

final readonly class TrashedExperienceSkill
{
    public function __invoke(null $_, array $args)
    {

        /** @var User | null */
        $user = Auth::user();

        // Can only be called by authenticated users
        if (! $user) {
            return null;
        }

        $experienceSkill = ExperienceSkill::with('userSkill')
            ->withTrashed()
            ->where('experience_id', $args['experienceId'])
            ->whereHas('userSkill', function (Builder $query) use ($args) {
                $query->where('skill_id', $args['skillId']);
            })
            ->first();

        Gate::authorize('viewTrashed', [ExperienceSkill::class, $experienceSkill]);

        if ($experienceSkill && (bool) ($args['restore'] ?? false)) {
            Gate::authorize('restore', [ExperienceSkill::class, $experienceSkill]);

            $experienceSkill->restore();
        }

        return $experienceSkill;
    }
}
