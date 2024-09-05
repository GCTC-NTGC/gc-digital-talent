<?php

namespace App\Generators;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class FileGenerator
{
    protected ?string $lang;

    protected ?string $userId;

    public function __construct(protected string $fileName, protected ?string $dir) {}

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

    /**
     * Set the user ID for the generator scopes
     *
     * @param  string  $userId  The user to scope the generator to
     */
    public function setUserId(string $userId)
    {
        $this->userId = $userId;

        return $this;
    }
}
