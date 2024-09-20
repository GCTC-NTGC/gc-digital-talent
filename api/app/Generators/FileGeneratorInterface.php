<?php

namespace App\Generators;

interface FileGeneratorInterface
{
    public function generate(): self;

    public function write();

    public function getFileName(): string;

    public function getPath(?string $disk = 'userGenerated'): string;
}
