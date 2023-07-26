<?php

namespace App\Policies;

use App\Models\DigitalContractingQuestionnaire;
use App\Models\User;

class DigitalContractingQuestionnairePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAbleTo("view-any-directiveForm");
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, DigitalContractingQuestionnaire $digitalContractingQuestionnaire): bool
    {
        // users aren't able to own questionnaires yet
        return $user->isAbleTo("view-any-directiveForm");
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAbleTo("create-any-directiveForm");
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, DigitalContractingQuestionnaire $digitalContractingQuestionnaire): bool
    {
        return $user->isAbleTo("update-any-directiveForm");
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, DigitalContractingQuestionnaire $digitalContractingQuestionnaire): bool
    {
        return $user->isAbleTo("delete-any-directiveForm");
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, DigitalContractingQuestionnaire $digitalContractingQuestionnaire): bool
    {
        return $user->isAbleTo("delete-any-directiveForm");
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, DigitalContractingQuestionnaire $digitalContractingQuestionnaire): bool
    {
        return $user->isAbleTo("delete-any-directiveForm");
    }
}
