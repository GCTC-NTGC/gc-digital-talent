<?php

namespace App\GraphQL\Mutations;

use App\Models\Department;
use Illuminate\Support\Carbon;

final class ArchiveDepartment
{
    /**
     * Archives the department by setting the archived_at to now().
     */
    public function __invoke($_, array $args)
    {
        /** @var Department|null $department */
        $department = Department::find($args['id']);
        if ($department) {
            $department->update(['archived_at' => Carbon::now()]);
        }

        return $department;
    }
}
