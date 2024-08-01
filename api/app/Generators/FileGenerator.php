<?php

namespace App\Generators;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Storage;

class FileGenerator
{
    protected ?string $lang;

    public function __construct(protected string $fileName, protected ?string $dir) {}

    /**
     * Convert enum to a more human readable format
     *
     * @param  string  $enum  The value of the enum
     */
    protected function sanitizeEnum(string $enum): string
    {
        return ucwords(strtolower(str_replace('_', ' ', $enum)));
    }

    /**
     *  Localize an enum value
     *
     * @param string String value of the enum
     * @param  class-string{\App\Traits\HasLocalization}  $enum  The enum class
     *
     * */
    protected function localizeEnum(?string $value, string $enum, ?string $subKey = null): string
    {
        if (! class_exists($enum) || ! $value) {
            return '';
        }

        /** @var \App\Traits\HasLocalization $enum */
        return $enum::localizedString($value, $subKey)[$this->lang] ?? '';
    }

    /**
     * Localize an array of enum values
     *
     * @param   array{string}   Array of the enum values are strins
     * @param class-string{\App\Traits\HasLocation} $enum The enum class being localized
     */
    protected function localizeEnumArray(array $values, string $enum): string
    {
        if (empty($values)) {
            return '';
        }

        return implode(', ', array_map(function ($value) use ($enum) {
            return $this->localizeEnum($value, $enum);
        }, $values));
    }

    /**
     *  Convert a boolean value into a localized
     *  "yes" or "no" statement
     *
     * @param  ?bool  $value  The value being converted
     * @return string "Yes" if true, "No" if false
     */
    public function yesOrNo(?bool $value): string
    {
        return $value ? Lang::get('common.yes', [], $this->lang) : Lang::get('common.no', [], $this->lang);
    }

    /**
     * Dividing colon based on language
     *
     * @return string
     */
    public function colon()
    {
        return $this->lang === 'fr' ? ' : ' : ': ';
    }

    /**
     * Strip out new line characters from a string
     *
     * @param  string  $string  A string with new lines
     * @return string New string with no new lines
     */
    public function sanitizeString(string $string): string
    {
        return str_replace(["\r", "\n"], ' ', $string);
    }

    /**
     * Localize a string based on the requested
     * file language
     *
     * @param  string  $key  The key of the string
     * @return string The localized string
     */
    public function localize(string $key): string
    {
        return Lang::get($key, [], $this->lang);
    }

    /**
     * Localize a heading in a file
     *
     * @param  string  $key  The heading key (from headings.php lang files)
     * @return string The localized heading
     */
    public function localizeHeading(string $key): string
    {
        return $this->localize('headings.'.$key);
    }

    public function getFileName(): string
    {
        return $this->fileName;
    }

    /**
     * Get  the path to eventually write the file to
     *
     * @param  ?string  $disk  Name of the disk we want to save file to
     */
    public function getPath(?string $disk = 'userGenerated')
    {
        /**
         * We don't actually put the file with
         * the storage (maybe we can look into that)
         * but for now, the writer does it directly
         * so we need to manually create the directory if
         * it doesn't exist
         *
         * @var \Illuminate\Filesystem\FilesystemManager */
        $disk = Storage::disk($disk);
        if ($this->dir && ! $disk->exists($this->dir)) {
            File::makeDirectory($disk->path($this->dir));
        }

        return $disk->path(sprintf('%s/%s', $this->dir ? DIRECTORY_SEPARATOR.$this->dir : '', $this->fileName));
    }
}
