<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;

/**
 * Class User
 *
 * @property int $id
 * @property string $email
 * @property string $sub
 * @property string $first_name
 * @property string $last_name
 * @property string $telephone
 * @property string $preferred_lang
 * @property array $roles
 * @property string $job_looking_status
 * @property string $current_province
 * @property string $current_city
 * @property boolean $looking_for_english
 * @property boolean $looking_for_french
 * @property boolean $looking_for_bilingual
 * @property string $bilingual_evaluation
 * @property string $comprehension_level
 * @property string $written_level
 * @property string $verbal_level
 * @property string $estimated_language_ability
 * @property string $is_gov_employee
 * @property string $interested_in_later_or_secondment
 * @property int $current_classification
 * @property boolean $is_woman
 * @property boolean $has_disability
 * @property boolean $is_indigenous
 * @property boolean $is_visible_minority
 * @property boolean $has_diploma
 * @property string $language_ability
 * @property array $location_preferences
 * @property array $location_exemptions
 * @property array $expected_salary
 * @property boolean $would_accept_temporary
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class User extends Model implements Authenticatable
{
    use HasFactory;
    use SoftDeletes;
    use AuthenticatableTrait;

    protected $keyType = 'string';

    protected $casts = [
        'roles' => 'array',
        'location_preferences' => 'array',
        'location_exemptions' => 'array',
        'expected_salary' => 'array',
    ];

    public function pools(): HasMany
    {
        return $this->hasMany(Pool::class);
    }
    public function poolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class);
    }
    public function currentClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, "current_classification");
    }
    public function acceptedOperationalRequirements(): BelongsToMany
    {
        return $this->belongsToMany(OperationalRequirement::class, 'operational_requirement_user');
    }
    public function expectedClassifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class, 'classification_user');
    }
    public function cmoAssets(): BelongsToMany
    {
        return $this->belongsToMany(CmoAsset::class);
    }

    public function isAdmin(): bool
    {
        return in_array('ADMIN', $this->roles);
    }

    // All the relationships for experiences
    public function awardExperiences(): HasMany
    {
        return $this->hasMany(AwardExperience::class);
    }
    public function communityExperiences(): HasMany
    {
        return $this->hasMany(CommunityExperience::class);
    }
    public function educationExperiences(): HasMany
    {
        return $this->hasMany(EducationExperience::class);
    }
    public function personalExperiences(): HasMany
    {
        return $this->hasMany(PersonalExperience::class);
    }
    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }
    public function getExperiencesAttribute()
    {
        $collection = collect();
        $collection = $collection->merge($this->awardExperiences);
        $collection = $collection->merge($this->communityExperiences);
        $collection = $collection->merge($this->educationExperiences);
        $collection = $collection->merge($this->personalExperiences);
        $collection = $collection->merge($this->workExperiences);
        return $collection;
    }

     /**
     * Boot function for using with User Events
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model)
        {
            $model->generateSubject();
        });
    }

     /**
     * Generates the value for the User::sub field. Used to
     * support authentication.
     * @return bool
     */
    protected function generateSubject()
    {
        // TODO when moving to Sign In Canada we won't be using email any more

        // fill sub with email if not already filled
        if( !array_key_exists('sub', $this->attributes) )
            $this->attributes['sub'] = $this->attributes['email'];

        if( is_null($this->attributes['sub']) )
            return false; // failed to create subject
        else
            return true;
    }
}
