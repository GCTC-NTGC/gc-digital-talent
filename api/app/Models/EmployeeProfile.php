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
 * @property ?bool $career_planning_lateral_move_interest
 * @property ?string $career_planning_lateral_move_time_frame
 * @property ?array $career_planning_lateral_move_organization_type
 * @property ?bool $career_planning_promotion_move_interest
 * @property ?string $career_planning_promotion_move_time_frame
 * @property ?array $career_planning_promotion_move_organization_type
 * @property ?array $career_planning_mentorship_status
 * @property ?array $career_planning_mentorship_interest
 * @property ?bool $career_planning_exec_interest
 * @property ?array $career_planning_exec_coaching_status
 * @property ?array $career_planning_exec_coaching_interest
 * @property string $career_planning_about_you
 * @property string $career_planning_learning_goals
 * @property string $career_planning_work_style
 * @property ?array $career_planning_learning_opportunities_interest
 * @property string $next_role_target_role
 * @property string $career_objective_target_role
 * @property string $next_role_target_role_other
 * @property string $career_objective_target_role_other
 * @property string $next_role_job_title
 * @property string $career_objective_job_title
 * @property string $next_role_additional_information
 * @property string $career_objective_additional_information
 * @property ?string $next_role_community_other
 * @property ?string $career_objective_community_other
 * @property ?bool $next_role_is_c_suite_role
 * @property ?bool $career_objective_is_c_suite_role
 * @property ?string $next_role_c_suite_role_title
 * @property ?string $career_objective_c_suite_role_title
 * @property ?bool $eligible_retirement_year_known
 * @property ?\Illuminate\Support\Carbon $eligible_retirement_year
 */
class EmployeeProfile extends Model
{
    protected $table = 'users';

    protected $keyType = 'string';

    protected $casts = [
        'career_planning_lateral_move_interest' => 'boolean',
        'career_planning_lateral_move_time_frame' => 'string',
        'career_planning_lateral_move_organization_type' => 'array',
        'career_planning_promotion_move_interest' => 'boolean',
        'career_planning_promotion_move_time_frame' => 'string',
        'career_planning_promotion_move_organization_type' => 'array',
        'career_planning_mentorship_status' => 'array',
        'career_planning_mentorship_interest' => 'array',
        'career_planning_exec_interest' => 'boolean',
        'career_planning_exec_coaching_status' => 'array',
        'career_planning_exec_coaching_interest' => 'array',
        'career_planning_learning_opportunities_interest' => 'array',
        'next_role_is_c_suite_role' => 'boolean',
        'career_objective_is_c_suite_role' => 'boolean',
        'eligible_retirement_year_known' => 'boolean',
        'eligible_retirement_year' => 'date',
    ];

    protected $fillable = [
        'career_planning_exec_interest',
        'career_planning_lateral_move_interest',
        'career_planning_lateral_move_time_frame',
        'career_planning_promotion_move_interest',
        'career_planning_promotion_move_time_frame',
        'career_planning_mentorship_status',
        'career_planning_mentorship_interest',
        'eligible_retirement_year_known',
        'eligible_retirement_year',
        'career_planning_exec_interest',
        'career_planning_promotion_move_organization_type',
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
        return $this->belongsToMany(WorkStream::class, 'user_work_stream_next_role', 'user_id', 'work_stream_id');
    }

    /** @return BelongsToMany<WorkStream, $this> */
    public function careerObjectiveWorkStreams(): BelongsToMany
    {
        return $this->belongsToMany(WorkStream::class, 'user_work_stream_career_objective', 'user_id', 'work_stream_id');
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
