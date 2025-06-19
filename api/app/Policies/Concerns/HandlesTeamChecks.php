<?php

namespace App\Policies\Concerns;

use App\Models\User;

trait HandlesTeamChecks
{
    /**
     * Checks if the user has the given permission via any of the related teams.
     *
     * @param  object  $model
     * @param  string|array  $teamRelations  One or more relation paths (e.g. 'pool.team' or ['pool.team', 'community.team'])
     */
    protected function isInTeam(User $user, $model, string $permission, $teamRelations): bool
    {
        $teamRelations = (array) $teamRelations;
        $model->loadMissing($teamRelations);
        foreach ($teamRelations as $relation) {
            $team = data_get($model, str_replace('.', '->', $relation));
            if ($team && $user->isAbleTo($permission, $team)) {
                return true;
            }
        }

        return false;
    }
}
