<?php

namespace App\Traits\Generator;

use App\Models\User;

/**
 * Shared helpers used in the Excel generators.
 */
trait GeneratesSharedExcelData
{
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
