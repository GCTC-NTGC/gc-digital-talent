<?php

namespace App\Generators;

abstract class FileGenerator
{
    abstract public function generate();

    abstract public function write(string $fileName);

    protected function sanitizeEnum(string $enum): string
    {
        return ucwords(strtolower(str_replace('_', ' ', $enum)));
    }

    public function yesOrNo(bool $value): string
    {
        return $value ? 'Yes' : 'No';
    }
}
