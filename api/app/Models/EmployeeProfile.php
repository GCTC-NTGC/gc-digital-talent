<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Class EmployeeProfile
 *
 * @property string $id
 * @property ?array $career_planning_organization_type_interest
 * @property ?array $career_planning_move_interest
 * @property ?array $career_planning_mentorship_status
 * @property ?array $career_planning_mentorship_interest
 * @property ?bool $career_planning_exec_interest
 * @property ?array $career_planning_exec_coaching_status
 * @property ?array $career_planning_exec_coaching_interest
 * @property string $career_planning_about_you
 * @property string $career_planning_career_goals
 * @property string $career_planning_learning_goals
 * @property string $career_planning_work_style
 * @property string $dream_role_title
 * @property string $dream_role_additional_information
 */
class EmployeeProfile extends Model
{
    protected $table = 'users';

    protected $keyType = 'string';

    protected $casts = [
        'career_planning_organization_type_interest' => 'array',
        'career_planning_move_interest' => 'array',
        'career_planning_mentorship_status' => 'array',
        'career_planning_mentorship_interest' => 'array',
        'career_planning_exec_interest' => 'boolean',
        'career_planning_exec_coaching_status' => 'array',
        'career_planning_exec_coaching_interest' => 'array',
    ];

    /** @return BelongsTo<Community, $this> */
    public function dreamRoleCommunity(): BelongsTo
    {
        return $this->belongsTo(Community::class, 'dream_role_community_id');
    }

    /** @return BelongsTo<Classification, $this> */
    public function dreamRoleClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, 'dream_role_classification_id');
    }

    /** @return BelongsTo<WorkStream, $this> */
    public function dreamRoleWorkStream(): BelongsTo
    {
        return $this->belongsTo(WorkStream::class, 'dream_role_work_stream_id');
    }

    /** @return BelongsToMany<Department, $this> */
    public function dreamRoleDepartments(): BelongsToMany
    {
        return $this->belongsToMany(Department::class, 'department_user_dream_role', 'user_id', 'department_id');
    }

    /** @return HasOne<User, $this> */
    public function userPublicProfile(): HasOne
    {
        return $this->hasOne(User::class, 'id')->select(['email', 'firstName', 'lastName']);
    }

    /** @return HasMany<CommunityInterest, $this> */
    public function communityInterests(): HasMany
    {
        return $this->hasMany(CommunityInterest::class, 'user_id');
    }
}
