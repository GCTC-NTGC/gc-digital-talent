<?php

namespace App\Console\Commands;

use App\Discoverers\EnumDiscoverer;
use App\Traits\HasLocalization;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Storage;

class CheckIntl extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-intl';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify enums are translated and nothing is missing';

    /**
     * The enums that are localized
     */
    private $localizedEnums;

    /**
     * Errors found
     */
    private $errors = [];

    /**
     * Allowed missing strings
     *
     * EnumName.case_key
     *
     * NOTE: Some cases we know are missing and do not intend
     * to have an associated string
     */
    private $knownMissing = [
        'skill_accepted',
        'legacy_is_indigenous',
    ];

    /**
     * Allowed exact matches
     *
     * EnumName.case_key
     *
     * NOTE: Some strings are known to be identical in
     * both locales, so we can safely ignore them
     */
    private $allowedMatch = [
        'international',
        'national',
        'provincial',
        'local',
        'certification',
        'inuit',
        'metis',
        'alberta',
        'manitoba',
        'nunavut',
        'ontario',
        'saskatchewan',
        'yukon',
        'lead',
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->localizedEnums = EnumDiscoverer::discoverLocalizedEnums();

        /** @var HasLocalization $enum */
        foreach ($this->localizedEnums as $enum) {
            $this->checkStrings($enum);
        }

        $hasErrors = ! empty(Arr::flatten($this->errors));

        if ($hasErrors) {
            Storage::disk('local')->put('intlErrors.json', json_encode($this->errors));
            $this->error("Errors found:\r\n\r\n".json_encode($this->errors, JSON_PRETTY_PRINT));

            return Command::FAILURE;
        }

        $this->info('Your translation files are ready to go!');

        return Command::SUCCESS;
    }

    /**
     * Check that strings exist and no
     * exact matches exist across locales
     *
     * @var HasLocalization
     */
    private function checkStrings($enum)
    {

        $fileName = $enum::getLangFilename();
        $hasEnFile = $this->checkFileExists($fileName, 'en');
        $hasFrFile = $this->checkFileExists($fileName, 'fr');

        $keys = Arr::map(array_column($enum::cases(), 'name'), function ($case) {
            return strtolower($case);
        });

        $existing = [
            'en' => $hasEnFile ? Arr::dot(Lang::get(key: $fileName, locale: 'en')) : [],
            'fr' => $hasFrFile ? Arr::dot(Lang::get(key: $fileName, locale: 'fr')) : [],
        ];

        $existingKeys = [
            'en' => array_keys($existing['en']),
            'fr' => array_keys($existing['fr']),
        ];

        $foundKeys = ['en' => [], 'fr' => []];

        foreach ($existing as $locale => $values) {
            // Confirm values are not empty
            foreach ($values as $key => $value) {
                $oppositeLocale = $this->oppositeLocale($locale);
                $keyIsInt = filter_var($key, FILTER_VALIDATE_INT) !== false;
                // If a key is an int it means it was input incorrectly and the value is the expected key (probably)
                $key = $keyIsInt ? $value : $key;

                // Key is an int so not likely to have a proper $key => $value
                if ($keyIsInt || ! $value) {
                    $this->errors['empty_strings'][$locale][$fileName][] = $key;
                }

                // Key exists in one locale but not the other
                if (! in_array($key, $existingKeys[$oppositeLocale])) {
                    $this->errors['orphan_strings'][$locale][$fileName][] = $key;
                }

                // Key does not match an Enum case
                $finalKey = $this->getKey($key);
                if (! in_array($finalKey, $keys)) {
                    $this->errors['extra_strings'][$locale][$fileName][] = $key;
                } else {
                    // Mark this key as found to diff it for missing keys later
                    $foundKeys[$locale][] = $finalKey;
                }
            }
        }

        // Find exact matches of strings across locales
        $intersectLocales = array_filter(array_keys(array_intersect_assoc($existing['en'], $existing['fr'])), function ($item) {
            return ! is_array($item) && ! in_array($item, $this->allowedMatch);
        });
        if (! empty($intersectLocales)) {
            $this->errors['matching_strings'][$fileName] = $intersectLocales;
        }

        // Find enum keys that do not exist in lang files
        foreach ($foundKeys as $locale => $found) {
            $missing = array_filter(Arr::flatten(array_diff($found, $keys)), function ($item) {
                return ! in_array($item, $this->knownMissing);
            });
            if (! empty($missing)) {
                $this->errors['missing_strings'][$locale][$fileName] = $missing;
            }
        }

    }

    /*
    * Check that a lang file exists
    */
    private function checkFileExists(string $fileName, string $locale)
    {
        if (! file_exists(lang_path($locale.'/'.$fileName.'.php'))) {
            $this->errors['missing_files'][$locale][] = $fileName;

            return false;
        }

        return true;
    }

    private function oppositeLocale(string $locale): string
    {
        return $locale === 'en' ? 'fr' : 'en';
    }

    private function getKey(string $key): string
    {

        if (! str_contains($key, '.')) {
            return $key;
        }

        $parts = explode('.', $key);

        return end($parts);
    }
}
