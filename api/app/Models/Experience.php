<?php

namespace App\Models;

use App\Traits\HydratesSnapshot;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Lang;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * Class Experience
 *
 * @property string $id
 * @property string $user_id
 * @property \Illuminate\Support\Carbon $start_date
 * @property ?\Illuminate\Support\Carbon $end_date
 * @property ?\Illuminate\Support\Carbon $awarded_date
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Experience extends Model
{
    use HasRelationships;
    use HydratesSnapshot;
    use SoftDeletes;

    protected $keyType = 'string';

    protected static $hydrationFields;

    /**
     * Create a new concrete model instance that is existing, based on the type field.
     *
     * @param  mixed  $attributes
     * @param  string|null  $connection
     * @return static
     */
    public function newFromBuilder($attributes = [], $connection = null)
    {
        /** @disregard Even though it is typed as an array, it is actually a class */
        $model = $this->newInstanceFromType(((object) $attributes)->experience_type);

        $model->exists = true;

        $model->setRawAttributes((array) $attributes, true);

        $model->setConnection($connection ?: $this->getConnectionName());

        $model->fireModelEvent('retrieved', false);

        return $model;
    }

    /**
     * Determine our model instance based on the type field.
     *
     *
     * @return mixed
     */
    private function newInstanceFromType(string $type)
    {
        // we're storing the actual class name in the type field so no adjustments are needed
        return new $type;
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsToMany<UserSkill, $this> */
    public function userSkills(): BelongsToMany
    {
        return $this->belongsToMany(UserSkill::class, 'experience_skill', 'experience_id')
            ->withTimestamps()
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
            ->as('experience_skill');
    }

    public function skills(): HasManyDeep
    {
        return $this->hasManyDeepFromRelations($this->userSkills(), (new UserSkill)->skill())
            ->withPivot('experience_skill', ['created_at', 'updated_at', 'details'])
            ->whereNull('experience_skill.deleted_at')
            ->withTrashed(); // from the deep relation $this->userSkills->skills fetch soft deleted skills but not userSkills
    }

    /** @return HasMany<ExperienceSkill, $this> */
    public function experienceSkills(): HasMany
    {
        return $this->hasMany(ExperienceSkill::class);
    }

    /**
     * Sync means we will add missing skills, remove skills not in this array, and update the details of existing skills.
     *
     * @param  array<string, array<string, string>>|null  $skills  - Skills must be an array of items, each of which must have an id, and optionally have a details string.
     * @return void
     */
    public function syncSkills($skills)
    {
        if ($skills === null) {
            return; // Just like the Eloquent sync operation, null will be ignored instead of overwriting existing values.
        }

        $skillIds = collect($skills)->pluck('id');
        // First ensure that UserSkills exist for each of these skills
        $this->user->addSkills($skillIds);

        // Soft-delete any existing ExperienceSkills left out of this sync operation
        ExperienceSkill::where('experience_id', $this->id)
            ->whereHas('userSkill', function ($query) use ($skillIds) {
                $query->whereNotIn('skill_id', $skillIds);
            })
            ->delete();

        // Now connect the skills which ARE in this sync operation
        $this->connectSkills($skills);
    }

    /**
     * Connect means we will add missing skills and update the details of existing skills, but not remove any skills.
     *
     * @param  array<string, array<string, string>>|null  $skills  - Skills must be an array of items, each of which must have an id, and optionally have a details string.
     * @return void
     */
    public function connectSkills($skills)
    {
        if ($skills === null) {
            return; // Just like the Eloquent sync operation, null will be ignored instead of overwriting existing values.
        }

        // First ensure that UserSkills exist for each of these skills
        $skillIds = collect($skills)->pluck('id');
        $this->user->addSkills($skillIds);

        $userSkills = UserSkill::where('user_id', $this->user_id)->get(); // Get this users UserSkills once, to avoid repeated db calls.

        // Restore soft-deleted experience-skills which need to be connected.
        ExperienceSkill::onlyTrashed()
            ->where('experience_id', $this->id)
            ->whereHas('userSkill', function ($query) use ($skillIds) {
                $query->whereIn('skill_id', $skillIds);
            })
            ->with('userSkill')
            ->restore();

        // Now get existing pivots (for updating details)
        $existingExperienceSkills = ExperienceSkill::where('experience_id', $this->id)
            ->whereHas('userSkill', function ($query) use ($skillIds) {
                $query->whereIn('skill_id', $skillIds);
            })
            ->with('userSkill')
            ->get();

        // We can't use the userSkills()->sync() operation because it will hard-delete ExperienceSkills, so loop through manually.
        foreach ($skills as $newSkill) {
            $newSkill = collect($newSkill);
            $existingPivot = $existingExperienceSkills->firstWhere('userSkill.skill_id', $newSkill->get('id'));
            if ($existingPivot) { // If pivot already exists, update details
                if ($newSkill->has('details')) { // Only update details if it was defined in the input args
                    $existingPivot->details = $newSkill->get('details');
                    $existingPivot->save();
                }
            } else { // If pivot doesn't exist yet, create it
                $userSkillId = $userSkills->where('skill_id', $newSkill->get('id'))->first()->id;
                $detailsArray = $newSkill->only('details')->toArray();
                $this->userSkills()->attach($userSkillId, $detailsArray);
            }
        }
        // If this experience instance continues to be used, ensure the in-memory instance is updated.
        $this->refresh();
    }

    public function disconnectSkills($skillIds)
    {
        if ($skillIds === null) {
            return; // Just like the Eloquent sync operation, null will be ignored instead of overwriting existing values.
        }
        // Find the userSkills that correspond to these skills.
        $userSkillIds = $this->user->userSkills()->whereIn('skill_id', $skillIds)->pluck('id');
        // Soft-delete these experience-skills
        ExperienceSkill::where('experience_id', $this->id)
            ->whereIn('user_skill_id', $userSkillIds)
            ->delete();
        // If this experience instance continues to be used, ensure the in-memory instance is updated.
        $this->refresh();
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($experience) {
            $user = $experience->user;
            if ($user) {
                $user->searchable();
            }
        });

        static::deleted(function ($experience) {
            $user = $experience->user;
            if ($user) {
                $user->searchable();
            }
        });
    }

    public function getDateRange($lang = 'en'): string
    {
        $format = 'MMM Y';
        if ($this->attributes['experience_type'] === AwardExperience::class) {
            return $this->awarded_date->locale($lang)->isoFormat($format);
        }

        $start = $this->start_date->locale($lang)->isoFormat($format);
        $end = $this->end_date ? $this->end_date->locale($lang)->isoFormat($format) : Lang::get('common.present', [], $lang);

        return "$start - $end";
    }

    protected static function getJsonPropertyDate(array $attributes, string $propertyName)
    {
        $properties = json_decode($attributes['properties'] ?? '{}');
        if (isset($properties->$propertyName) && ! empty($properties->$propertyName)) {
            return Carbon::parse($properties->$propertyName);
        }

        return null;
    }

    protected static function setJsonPropertyDate(mixed $value, ?array $attributes, string $propertyName)
    {
        $properties = json_decode($attributes['properties'] ?? '{}');
        if (! empty($value)) {
            $properties->$propertyName = Carbon::parse($value)->toDateString();
        } else {
            $properties->$propertyName = null;
        }

        return ['properties' => json_encode($properties)];
    }

    protected function makeJsonPropertyDateAttribute(string $propertyName): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, mixed $attributes) => $this::getJsonPropertyDate($attributes, $propertyName),
            set: fn (mixed $value, ?array $attributes = []) => $this::setJsonPropertyDate($value, $attributes, $propertyName)
        );
    }

    protected static function getJsonPropertyString(array $attributes, string $propertyName)
    {

        $properties = json_decode($attributes['properties'] ?? '{}');
        if (isset($properties->$propertyName)) {
            return strval($properties->$propertyName);
        }

        return null;
    }

    protected static function setJsonPropertyString(mixed $value, array $attributes, string $propertyName)
    {
        $properties = json_decode($attributes['properties'] ?? '{}');
        $properties->$propertyName = ! is_null($value) ? strval($value) : $value;

        return ['properties' => json_encode($properties)];
    }

    protected function makeJsonPropertyStringAttribute(string $propertyName): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, $propertyName),
            set: fn (mixed $value, ?array $attributes = []) => $this::setJsonPropertyString($value, $attributes, $propertyName)
        );
    }

    protected static function getJsonPropertyArray(array $attributes, string $propertyName)
    {

        $properties = json_decode($attributes['properties'] ?? '{}');
        if (isset($properties->$propertyName)) {
            return $properties->$propertyName;
        }

        return null;
    }

    protected static function setJsonPropertyArray(mixed $value, array $attributes, string $propertyName)
    {
        $properties = json_decode($attributes['properties'] ?? '{}');
        if (is_array($value)) {
            $properties->$propertyName = array_unique($value);
        }

        return ['properties' => json_encode($properties)];
    }

    protected function makeJsonPropertyArrayAttribute(string $propertyName): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyArray($attributes, $propertyName),
            set: fn (mixed $value, ?array $attributes = []) => $this::setJsonPropertyArray($value, $attributes, $propertyName)
        );
    }

    /**
     * @param  mixed  $snapshot  the snapshot
     * @return array array of experiences
     */
    public static function hydrateSnapshot(mixed $snapshot): Model|array
    {
        $experiences = [];
        foreach ($snapshot as $experience) {
            $hydrationModel = match ($experience['__typename']) {
                'AwardExperience' => AwardExperience::class,
                'CommunityExperience' => CommunityExperience::class,
                'EducationExperience' => EducationExperience::class,
                'PersonalExperience' => PersonalExperience::class,
                'WorkExperience' => WorkExperience::class,
                default => null,
            };

            if ($hydrationModel) {
                $fields = [
                    ...$hydrationModel::$hydrationFields,
                    'id' => 'id',
                    'details' => 'details',
                ];

                $model = new $hydrationModel;
                $experiences[] = self::hydrateFields($experience, $fields, $model);
            }
        }

        return $experiences;
    }
}
