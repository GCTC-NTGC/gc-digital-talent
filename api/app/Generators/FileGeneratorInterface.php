<?php

namespace App\Generators;

interface FileGeneratorInterface
{
    public function generate(): self;

    public function write();
}
