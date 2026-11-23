<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * Class JobAlertFilter
 *
 * @property string $id
 * @property ?array $keyword_search
 * @property ?array $eligibility
 * @property ?array $languages
 * @property ?string $salary_range
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 */
class JobAlertFilter extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    protected $casts = [
        'keyword_search' => 'array',
        'eligibility' => 'array',
        'languages' => 'array',
    ];

    /** @return BelongsToMany<Department, $this> */
    public function departments(): BelongsToMany
    {
        return $this->belongsToMany(Department::class);
    }

    /** @return BelongsToMany<Classification, $this> */
    public function classifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class);
    }

    // Map back to PublishedPoolsSearchInput keys so alerts reuse the live search scopes; null and empty lists are dropped
    public function toSearchArgs(): array
    {
        $args = [
            'keywordSearch' => $this->keyword_search,
            'eligibility' => $this->eligibility,
            'departments' => $this->departments->pluck('id')->all(),
            'classifications' => $this->classifications->pluck('id')->all(),
            'languages' => $this->languages,
            'salaryRange' => $this->salary_range,
        ];

        return array_filter($args, fn ($value) => ! is_null($value) && $value !== []);
    }
}
