<?php

namespace App\Models;

use App\Models\Scopes\MatchExperienceType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class AwardExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $issued_by
 * @property ?\Illuminate\Support\Carbon $awarded_date
 * @property string $awarded_to
 * @property string $awarded_scope
 * @property string $details
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class AwardExperience extends Experience
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
     */
    protected $attributes = [
        'experience_type' => AwardExperience::class,
    ];

    protected static $hydrationFields = [
        'title' => 'title',
        'issued_by' => 'issuedBy',
        'awarded_date' => 'awardedDate',
        'awarded_to' => 'awardedTo',
        'awarded_scope' => 'awardedScope',
    ];

    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new MatchExperienceType);
    }

    /**
     * Interact with the experience's title
     */
    protected function title(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('title');
    }

    /**
     * Interact with the experience's issued by
     */
    protected function issuedBy(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('issued_by');
    }

    /**
     * Interact with the experience's award date
     */
    protected function awardedDate(): Attribute
    {
        return $this->makeJsonPropertyDateAttribute('awarded_date');
    }

    /**
     * Interact with the experience's awarded to
     */
    protected function awardedTo(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('awarded_to');
    }

    /**
     * Interact with the experience's awarded scope
     */
    protected function awardedScope(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('awarded_scope');
    }
}
