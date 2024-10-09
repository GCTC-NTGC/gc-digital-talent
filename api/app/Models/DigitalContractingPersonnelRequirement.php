<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class DigitalContractingPersonnelRequirement
 *
 * @property string $id
 * @property string $resource_type
 * @property string $language
 * @property string $language_other
 * @property string $security
 * @property string $security_other
 * @property string $telework
 * @property int $quantity
 */
class DigitalContractingPersonnelRequirement extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    public function digitalContractingQuestionnaire(): BelongsTo
    {
        return $this->belongsTo(DigitalContractingQuestionnaire::class);
    }

    public function skillRequirements(): HasMany
    {
        return $this->hasMany(DigitalContractingPersonnelSkill::class);
    }
}
