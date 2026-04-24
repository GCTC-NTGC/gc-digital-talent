<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ExperienceSkill;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

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
            ->whereHas('userSkill', function (Builder $query) use ($args, $user) {
                $query->where('skill_id', $args['skillId'])
                    ->where('user_id', $user->id);
            })
            ->first();

        if ($experienceSkill && (bool) ($args['restore'] ?? false)) {
            $experienceSkill->restore();
        }

        return $experienceSkill;
    }
}
