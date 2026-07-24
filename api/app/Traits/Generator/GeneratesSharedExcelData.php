<?php

namespace App\Traits\Generator;

use App\Models\User;
use Illuminate\Support\Facades\Lang;

/**
 * Shared helpers used in the Excel generators.
 */
trait GeneratesSharedExcelData
{
    // store user ids
    protected array $userIds = [];

    // store each nominee consent to share their profile
    protected array $consentToShareByUserId = [];

    // apply consent to share when generating the excel file
    protected bool $enforceConsentToShare = false;

    /**
     * Check if user consented to share data
     */
    private function canShareForUser(?string $userId): bool
    {
        if (! $this->enforceConsentToShare) {
            return true;
        }

        return $this->consentToShareByUserId[$userId] ?? false;
    }

    /**
     * Hide user data if no consent to share
     */
    private function applyConsentToRow(array $row, ?string $userId): array
    {
        if ($this->canShareForUser($userId)) {
            return $row;
        }

        return array_map(function ($value, $index) {
            return $index === 0 ? $value : Lang::get('common.not_available', [], $this->lang);
        }, $row, array_keys($row));
    }

    /**
     * Get work streams from a model
     */
    private function getWorkStreams($model): string
    {
        if (! $model->workStreams) {
            return '';
        }

        return $model->workStreams
            ->map(fn ($workStream) => $workStream->name[$this->lang] ?? '')
            ->filter()
            ->join(', ');
    }

    /**
     * Get looking for languages
     */
    private function lookingForLanguages(User $user): string
    {
        $languages = [];

        if ($user->looking_for_english) {
            $languages[] = $this->localize('language.en');
        }

        if ($user->looking_for_french) {
            $languages[] = $this->localize('language.fr');
        }

        if ($user->looking_for_bilingual) {
            $languages[] = $this->localize('common.bilingual');
        }

        return implode(', ', $languages);
    }
}
