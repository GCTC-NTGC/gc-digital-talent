<?php

namespace App\GraphQL\Mutations;

use App\Models\Department;

final class UnarchiveDepartment
{
    /**
     * Unarchives the department by clearing the archived_at timestamp.
     */
    public function __invoke($_, array $args)
    {
        /** @var Department|null $department */
        $department = Department::find($args['id']);
        if ($department) {
            $department->archived_at = null;
            $department->save();
        }

        return $department;
    }
}
