<?php

namespace App\GraphQL\Mutations;

use App\Models\Department;
use Illuminate\Support\Carbon;

final class ArchiveDepartment
{
    /**
     * Archives the department by setting the archived_at to now().
     * As well as update the name to indicate its archived status
     */
    public function __invoke($_, array $args)
    {
        /** @var Department|null $department */
        $department = Department::find($args['id']);
        if ($department) {
            $departmentArchivedNameEnglish = $department->name['en'].' (Archived)';
            $departmentArchivedNameFrench = $department->name['fr'].' (Archivé)';

            $department->archived_at = Carbon::now();
            $department->name = [
                'en' => $departmentArchivedNameEnglish,
                'fr' => $departmentArchivedNameFrench,
            ];

            $department->save();
        }

        return $department;
    }
}
