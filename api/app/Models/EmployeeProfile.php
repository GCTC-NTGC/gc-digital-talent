<?php

namespace App\Models;

use App\Enums\TargetRole;
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
 * @property string $next_role_target_role
 * @property string $career_objective_target_role
 * @property string $next_role_target_role_other
 * @property string $career_objective_target_role_other
 * @property string $next_role_job_title
 * @property string $career_objective_job_title
 * @property string $next_role_additional_information
 * @property string $career_objective_additional_information
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
        'next_role_target_role' => TargetRole::class,
        'career_objective_target_role' => TargetRole::class,
    ];

    /** @return BelongsTo<Community, $this> */
    public function nextRoleCommunity(): BelongsTo
    {
        return $this->belongsTo(Community::class, 'next_role_community_id');
    }

    /** @return BelongsTo<Community, $this> */
    public function careerObjectiveCommunity(): BelongsTo
    {
        return $this->belongsTo(Community::class, 'career_objective_community_id');
    }

    /** @return BelongsTo<Classification, $this> */
    public function nextRoleClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, 'next_role_classification_id');
    }

    /** @return BelongsTo<Classification, $this> */
    public function careerObjectiveClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, 'career_objective_classification_id');
    }

    /** @return BelongsToMany<WorkStream, $this> */
    public function nextRoleWorkStreams(): BelongsToMany
    {
        return $this->belongsToMany(WorkStream::class, 'user_work_stream_next_role');
    }

    /** @return BelongsToMany<WorkStream, $this> */
    public function careerObjectiveWorkStreams(): BelongsToMany
    {
        return $this->belongsToMany(WorkStream::class, 'user_work_stream_career_objective');
    }

    /** @return BelongsToMany<Department, $this> */
    public function nextRoleDepartments(): BelongsToMany
    {
        return $this->belongsToMany(Department::class, 'department_user_next_role', 'user_id', 'department_id');
    }

    /** @return BelongsToMany<Department, $this> */
    public function careerObjectiveDepartments(): BelongsToMany
    {
        return $this->belongsToMany(Department::class, 'department_user_career_objective', 'user_id', 'department_id');
    }

    /** @return HasOne<User, $this> */
    public function userPublicProfile(): HasOne
    {
        return $this->hasOne(User::class, 'id')->select(['id', 'email', 'first_name', 'last_name']);
    }

    /** @return HasMany<CommunityInterest, $this> */
    public function communityInterests(): HasMany
    {
        return $this->hasMany(CommunityInterest::class, 'user_id');
    }
}
