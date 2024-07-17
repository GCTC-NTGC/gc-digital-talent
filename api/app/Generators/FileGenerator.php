<?php

namespace App\Generators;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

abstract class FileGenerator
{
    protected string $lang;

    abstract public function generate();

    abstract public function write(string $fileName, ?string $dir);

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
    protected function localizeEnum(?string $value, string $enum): string
    {

        Log::debug(['value' => $value]);

        if (! class_exists($enum) || ! $value) {
            return '';
        }

        /** @var \App\Traits\HasLocalization $enum */
        return $enum::localizedString($value)[$this->lang] ?? '';
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

    public function yesOrNo(?bool $value): string
    {
        return $value ? Lang::get('common.yes', [], $this->lang) : Lang::get('common.no', [], $this->lang);
    }

    public function getPath(string $fileName, ?string $dir, ?string $disk = 'userGenerated')
    {
        /** @var \Illuminate\Filesystem\FilesystemManager */
        $disk = Storage::disk($disk);
        if ($dir && ! $disk->exists($dir)) {
            File::makeDirectory($disk->path($dir));
        }

        return $disk->path(sprintf('%s/%s', $dir ? DIRECTORY_SEPARATOR.$dir : '', $fileName));
    }
}
