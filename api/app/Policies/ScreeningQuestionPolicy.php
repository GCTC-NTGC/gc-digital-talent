<?php

namespace App\Policies;

use App\Models\ScreeningQuestion;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ScreeningQuestionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view parent assessment step
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAssessmentStep(User $user, ScreeningQuestion $screeningQuestion)
    {
        if ($user->isAbleTo('view-any-pool')) {
            return true;
        }

        $screeningQuestion->loadMissing('pool.team');

        return $user->isAbleTo('view-team-pool', $screeningQuestion->pool->team);
    }
}
