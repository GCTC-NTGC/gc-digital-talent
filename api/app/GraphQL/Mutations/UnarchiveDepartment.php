<?php

namespace App\GraphQL\Mutations;

use App\Models\Department;

final class UnarchiveDepartment
{
    /**
     * Unarchives the department by clearing the archived_at timestamp.
     * As well as removes the archived bit from the the name.
     */
    public function __invoke($_, array $args)
    {
        /** @var Department|null $department */
        $department = Department::find($args['id']);
        if ($department) {
            $departmentNameEnglish = str_ireplace(' (Archived)', '', $department->name['en']);
            $departmentNameFrench = str_ireplace(' (Archivé)', '', $department->name['fr']);

            $department->archived_at = null;
            $department->name = [
                'en' => $departmentNameEnglish,
                'fr' => $departmentNameFrench,
            ];
            $department->save();
        }

        return $department;
    }
}
