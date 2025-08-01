<?php

namespace App\Generators;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class FileGenerator
{
    protected ?string $lang;

    protected ?string $authenticatedUserId;

    protected string $extension = '';

    public function __construct(protected string $fileName, protected ?string $dir) {}

    public function getFileName(): string
    {
        return $this->fileName;
    }

    public function getFileNameWithExtension(): string
    {
        return $this->fileName.'.'.$this->extension;
    }

    public function getExtension(): string
    {
        return $this->extension;
    }

    public function setFileName(string $fileName): void
    {
        $this->fileName = $fileName;
    }

    /**
     * Get the path to eventually write the file to
     *
     * @param  ?string  $diskName  Name of the disk we want to save file to
     */
    public function getPath(?string $diskName = 'userGenerated'): string
    {
        $disk = $this->getDisk($diskName);

        return $disk->path($this->getRelativePath());
    }

    /**
     * Get the current disk for this file
     *
     * @param  ?string  $diskName  Name of the disk we want to save file to
     */
    public function getDisk(?string $diskName = 'userGenerated'): FilesystemAdapter
    {
        /**
         * We don't actually put the file with
         * the storage (maybe we can look into that)
         * but for now, the writer does it directly
         * so we need to manually create the directory if
         * it doesn't exist
         */
        $disk = Storage::disk($diskName);
        if ($this->dir && ! $disk->exists($this->dir)) {
            File::makeDirectory($disk->path($this->dir));
        }

        return $disk;
    }

    /**
     * Get a relative path to be used by the disk
     */
    public function getRelativePath()
    {
        return sprintf('%s%s', $this->dir ? DIRECTORY_SEPARATOR.$this->dir : '', DIRECTORY_SEPARATOR.$this->getFileNameWithExtension());
    }

    /**
     * Sanitize string for file name
     *
     * @param  ?string  $value  String to be sanitized
     * @return string Sanitized string
     */
    public function sanitizeFileNameString(?string $value)
    {
        if (! $value) {
            return '';
        }

        $retval = $value;
        $retval = iconv('UTF-8', 'ASCII//TRANSLIT', $retval); // handle accented characters
        $retval = preg_replace('/[^a-zA-Z]+/', '', $retval); // remove anything that isn't an alphabet character
        $retval = trim($retval);

        return $retval;
    }

    /**
     * Set the authenticated user ID for the generator scopes
     *
     * @param  string  $authenticatedUserId  The authenticated user to scope the generator to
     */
    public function setAuthenticatedUserId(string $authenticatedUserId)
    {
        $this->authenticatedUserId = $authenticatedUserId;

        return $this;
    }
}
