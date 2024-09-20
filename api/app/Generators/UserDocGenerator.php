<?php

namespace App\Generators;

use App\Models\User;
use App\Traits\Generator\GeneratesUserDoc;

class UserDocGenerator extends DocGenerator implements FileGeneratorInterface
{
    use GeneratesUserDoc;

    public function __construct(protected User $user, protected bool $anonymous, public ?string $dir, protected ?string $lang)
    {
        $lastName = $this->santitizeFileNameString($user?->last_name);
        if ($anonymous) {
            $lastName = substr($lastName, 0, 1);
        }
        $fileName = sprintf(
            '%s %s - Profile - Profil',
            $this->santitizeFileNameString($user?->first_name),
            $lastName,
        );

        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->setup();

        $section = $this->doc->addSection();
        $section->addTitle($this->localizeHeading('user_profile'), 1);

        $this->generateUser($section, $this->user);

        return $this;
    }
}
