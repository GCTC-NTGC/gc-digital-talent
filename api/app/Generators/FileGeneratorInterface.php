<?php

namespace App\Generators;

interface FileGeneratorInterface
{
    public function generate(): self;

    public function write();

    public function getFileName(): string;

    public function getExtension(): string;

    public function getFileNameWithExtension(): string;

    public function setFileName(string $name): void;

    public function getPath(?string $disk = 'userGenerated'): string;
}
