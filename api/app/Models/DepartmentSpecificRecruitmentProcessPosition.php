<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class DepartmentSpecificRecruitmentProcessPosition
 *
 * @property string $id
 * @property string $classification_group
 * @property string $classification_level
 * @property string $job_title
 * @property array $employment_types
 * @property string $employment_types_other
 */
class DepartmentSpecificRecruitmentProcessPosition extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    protected $casts = [
        'employment_types' => 'array',
    ];

    public function departmentSpecificRecruitmentProcessForm(): BelongsTo
    {
        return $this->belongsTo(DepartmentSpecificRecruitmentProcessForm::class);
    }
}
