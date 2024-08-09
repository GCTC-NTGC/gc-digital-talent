<?php

namespace App\Models;

use App\Models\Scopes\MatchExperienceType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Lang;

/**
 * Class WorkExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $role
 * @property string $organization
 * @property string $division
 * @property Illuminate\Support\Carbon $start_date
 * @property Illuminate\Support\Carbon $end_date
 * @property string $details
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class WorkExperience extends Experience
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'experiences';

    /**
     * Default values for attributes
     *
     * @var array an array with attribute as key and default as value
     */
    protected $attributes = [
        'experience_type' => WorkExperience::class,
    ];

    protected static $hydrationFields = [
        'organization' => ['organization'],
        'role' => ['role'],
        'division' => ['division'],
        'start_date' => ['startDate'],
        'end_date' => ['endDate'],
    ];

    public function getTitle(?string $lang = 'en'): string
    {
        return sprintf('%s %s %s', $this->role, Lang::get('common.at', [], $lang), $this->organization);
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new MatchExperienceType);
    }

    /**
     * Interact with the experience's role
     */
    protected function role(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('role');
    }

    /**
     * Interact with the experience's organization
     */
    protected function organization(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('organization');
    }

    /**
     * Interact with the experience's division
     */
    protected function division(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('division');
    }

    /**
     * Interact with the experience's start date
     */
    protected function startDate(): Attribute
    {
        return $this->makeJsonPropertyDateAttribute('start_date');
    }

    /**
     * Interact with the experience's end date
     */
    protected function endDate(): Attribute
    {
        return $this->makeJsonPropertyDateAttribute('end_date');
    }
}
