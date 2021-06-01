<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PoolCandidate
 *
 * @property int $id
 * @property string $cmo_identifier
 * @property Illuminate\Support\Carbon $expiry_date
 * @property boolean $is_woman
 * @property boolean $has_disability
 * @property boolean $is_indigenous
 * @property boolean $is_visible_minority
 * @property boolean $has_diploma
 * @property string $language_ability
 * @property string $location_preferences
 * @property string $expected_salary
 * @property string $pool_candidate_status
 * @property int $pool_id
 * @property int $user_id
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class PoolCandidate extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'expiry_date' => 'date',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
    public function pool() {
        return $this->belongsTo(Pool::class);
    }
    public function acceptedOperationalRequirements() {
        return $this->belongsToMany(OperationalRequirement::class, 'operational_requirement_pool_candidate');
    }
    public function expectedClassifications() {
        return $this->belongsToMany(Classification::class, 'classification_pool_candidate');
    }
    public function cmoAssets() {
        return $this->belongsToMany(CmoAsset::class);
    }

}
