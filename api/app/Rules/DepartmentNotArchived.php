<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\Department;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class DepartmentNotArchived implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $department = Department::findOrFail($value);

        if (! is_null($department->archived_at)) {
            $fail(ErrorCode::DEPARTMENT_MUST_NOT_BE_ARCHIVED->name);
        }
    }
}
