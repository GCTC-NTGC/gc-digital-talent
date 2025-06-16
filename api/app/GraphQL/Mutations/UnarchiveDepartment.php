<?php

namespace App\GraphQL\Mutations;

use App\Models\Department;

final class UnarchiveDepartment
{
    /**
     * Un-archives the department by clearing the archived_at timestamp.
     */
    public function __invoke($_, array $args)
    {
        /** @var Department|null $department */
        $department = Department::find($args['id']);
        if ($department) {
            $department->update(['archived_at' => null]);
        }

        return $department;
    }
}
