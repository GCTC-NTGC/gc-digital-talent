<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class DepartmentSpecificRecruitmentProcessForm
 *
 * @property string $id
 * @property string $department_other
 * @property string $branch_other
 * @property string $recruitment_process_lead_name
 * @property string $recruitment_process_lead_job_title
 * @property string $recruitment_process_lead_email
 * @property string $posting_date
 * @property string $advertisement_type
 * @property array $advertising_platforms
 * @property string $advertising_platforms_other
 * @property string $job_advertisement_link
 */
class DepartmentSpecificRecruitmentProcessForm extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    protected $casts = [
        'advertising_platforms' => 'array',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function positions(): HasMany
    {
        return $this->hasMany(DepartmentSpecificRecruitmentProcessPosition::class);
    }
}
