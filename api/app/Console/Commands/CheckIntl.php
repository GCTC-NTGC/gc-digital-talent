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
     * Missing translation files
     */
    private $missingFiles = ['en' => [], 'fr' => []];

    /**
     * Missing strings
     */
    private $missingStrings = ['en' => [], 'fr' => []];

    /**
     * Matching strings
     *
     * Any string that is the same in both locales
     */
    private $exactMatches = [];

    /**
     * Allowed missing strings
     *
     * EnumName.case_key
     *
     * NOTE: Some cases we know are missing and do not intend
     * to have an associated string
     */
    private $knownMissing = [
        'assessment_result_justification.skill_accepted',
        'indigenous_community.legacy_is_indigenous',
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
        'awarded_scope.international',
        'awarded_scope.national',
        'awarded_scope.provincial',
        'awarded_scope.local',
        'education_type.certification',
        'indigenous_community.inuit',
        'indigenous_community.metis',
        'province_or_territory.alberta',
        'province_or_territory.manitoba',
        'province_or_territory.nunavut',
        'province_or_territory.ontario',
        'province_or_territory.saskatchewan',
        'province_or_territory.yukon',
        'skill_level.lead',
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->localizedEnums = EnumDiscoverer::discoverLocalizedEnums();

        /** @var HasLocalization $enum */
        foreach ($this->localizedEnums as $enum) {
            $fileName = $enum::getLangFilename().'.php';
            $enFileExists = $this->checkFileExists($fileName, 'en');
            $frFileExists = $this->checkFileExists($fileName, 'fr');

            // No sense in checking strings if both files are missing.
            if ($enFileExists || $frFileExists) {
                $this->checkStrings($enum);
            }

        }

        $missingFiles = ! empty(Arr::flatten($this->missingFiles));
        $missingStrings = ! empty(Arr::flatten($this->missingStrings));
        $exactMatches = ! empty($this->exactMatches);

        if ($missingFiles || $missingStrings || $exactMatches) {
            if ($missingFiles) {
                Storage::disk('local')->put('missingFiles.json', json_encode($this->missingFiles));
                $this->error("Missing files:\r\n\r\n".$this->localeArrayToString($this->missingFiles));
            }

            if ($missingStrings) {
                Storage::disk('local')->put('missingStrings.json', json_encode($this->missingStrings));
                $this->error("Missing strings:\r\n\r\n".$this->localeArrayToString($this->missingStrings));
            }

            if ($exactMatches) {
                Storage::disk('local')->put('exactMatches.json', json_encode($this->exactMatches));
                $this->error("Some strings are identical in both EN and FR:\r\n".$this->arrayToString($this->exactMatches));
            }

            return Command::FAILURE;
        }

        $this->info('Your translation files are ready to go!');

        return Command::SUCCESS;
    }

    /*
    * Check that a lang file exists
    */
    private function checkFileExists(string $fileName, string $locale)
    {
        if (! file_exists(lang_path($locale.'/'.$fileName))) {
            $this->missingFiles[$locale][] = $fileName;

            return false;
        }

        return true;
    }

    /**
     * Check that strings exist and no
     * exact matches exist across locales
     *
     * @var HasLocalization
     */
    private function checkStrings($enum)
    {
        $keys = Arr::map(array_column($enum::cases(), 'name'), function ($case) {
            return strtolower($case);
        });

        foreach ($keys as $key) {
            $langKey = $enum::getLangKey($key);

            if (! in_array($langKey, $this->knownMissing)) {
                $hasEn = Lang::hasForLocale($langKey, 'en');
                $hasFr = Lang::hasForLocale($langKey, 'fr');

                if ($hasEn && $hasFr && ! in_array($langKey, $this->allowedMatch)) {
                    if (Lang::get($langKey, [], 'en') === Lang::get($langKey, [], 'fr')) {
                        $this->exactMatches[] = $langKey;
                    }
                } else {
                    if (! $hasEn) {
                        $this->missingStrings['en'][] = $langKey;
                    }

                    if (! $hasFr) {
                        $this->missingStrings['fr'][] = $langKey;
                    }
                }
            }

        }
    }

    private function localeArrayToString(array $arr)
    {
        $string = '';
        if (isset($arr['en']) && ! empty($arr['en'])) {
            $string .= "English:\r\n".$this->arrayToString($arr['en'])."\r\n";
        }

        if (isset($arr['fr']) && ! empty($arr['fr'])) {
            $string .= "French:\r\n".$this->arrayToString($arr['fr'])."\r\n";
        }

        return $string;
    }

    /**
     * Create a string list from array
     */
    private function arrayToString(array $arr)
    {
        return implode("\r\n", Arr::map($arr, function ($value) {
            return "\t- $value";
        }));
    }
}
