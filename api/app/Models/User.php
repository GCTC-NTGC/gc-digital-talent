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
 * @property string $id
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
 * @property string $current_classification
 * @property boolean $is_woman
 * @property boolean $has_disability
 * @property boolean $is_indigenous
 * @property boolean $is_visible_minority
 * @property boolean $has_diploma
 * @property string $language_ability
 * @property array $location_preferences
 * @property string $location_exemptions
 * @property array $expected_salary
 * @property boolean $would_accept_temporary
 * @property array $accepted_operational_requirements
 * @property string $gov_employee_type
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
        'expected_salary' => 'array',
        'accepted_operational_requirements' => 'array',
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
    public function expectedClassifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class, 'classification_user')->withTimestamps();
    }
    public function cmoAssets(): BelongsToMany
    {
        return $this->belongsToMany(CmoAsset::class)->withTimestamps();
    }

    public function isAdmin(): bool
    {
        return is_array($this->roles) && in_array('ADMIN', $this->roles);
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

     // getIsProfileCompleteAttribute function is correspondent to isProfileComplete attribute in graphql schema

   public function getIsProfileCompleteAttribute(): bool
    {if(is_null($this->attributes['first_name']) Or
        is_null($this->attributes['last_name']) Or
        is_null($this->attributes['email']) Or
        is_null($this->attributes['telephone']) Or
        is_null($this->attributes['preferred_lang']) Or
        is_null($this->attributes['current_province']) Or
        is_null($this->attributes['current_city']) Or
            (is_null($this->attributes['looking_for_english']) &&
            is_null($this->attributes['looking_for_french']) &&
            is_null($this->attributes['looking_for_bilingual'])) Or
        is_null($this->attributes['is_gov_employee']) Or
        is_null($this->attributes['location_preferences']) Or
        is_null($this->attributes['expected_salary']) Or
        is_null($this->attributes['would_accept_temporary'])
        )   {
            return false;
            }
        else{
            return true;
        }
    }
}
