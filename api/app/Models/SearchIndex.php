<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

/**
 * Class Search Index
 *
 * @property string $id
 * @property string $user_id
 * @property tsvector $searchable
 */
class SearchIndex extends Model
{
    use Searchable;

    protected $keyType = 'string';

    protected $casts = [];

    protected $fillable = [];

    public $guarded = [];

    public function toSearchableArray(): array
    {
        $this->loadMissing([
            'user.poolCandidates',
            'user.workExperiences',
            'user.educationExperiences',
            'user.personalExperiences',
            'user.communityExperiences',
            'user.awardExperiences',
        ]);

        $result = null;

        if (! empty($this->user)) {
            $result = collect([
                $this->user->email, $this->user->first_name, $this->user->last_name, $this->user->telephone, $this->user->current_province, $this->user->current_city,
                $this->user->poolCandidates->pluck('notes'),
                $this->user->workExperiences->pluck('role'),
                $this->user->workExperiences->pluck('organization'),
                $this->user->workExperiences->pluck('division'),
                $this->user->workExperiences->pluck('details'),
                $this->user->educationExperiences->pluck('thesis_title'),
                $this->user->educationExperiences->pluck('institution'),
                $this->user->educationExperiences->pluck('details'),
                $this->user->educationExperiences->pluck('area_of_study'),
                $this->user->personalExperiences->pluck('title'),
                $this->user->personalExperiences->pluck('description'),
                $this->user->personalExperiences->pluck('details'),
                $this->user->communityExperiences->pluck('title'),
                $this->user->communityExperiences->pluck('organization'),
                $this->user->communityExperiences->pluck('project'),
                $this->user->communityExperiences->pluck('details'),
                $this->user->awardExperiences->pluck('title'),
                $this->user->awardExperiences->pluck('details'),
                $this->user->awardExperiences->pluck('issued_by'),
            ])
                ->flatten()
                ->reject(function ($value) {
                    return is_null($value) || $value === '';
                })->toArray();
        }

        if (! $result) {
            // SQL query doesn't handle empty arrays for some reason?
            $result = [' '];
        }

        return $result;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
