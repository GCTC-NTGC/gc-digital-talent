<?php

namespace App\Generators;

use App\Models\User;
use App\Traits\Generator\GeneratesUserDoc;

class UserDocGenerator extends DocGenerator implements FileGeneratorInterface
{
    use GeneratesUserDoc;

    public function __construct(protected array $ids, protected bool $anonymous, public string $fileName, public ?string $dir, protected ?string $lang)
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->setup();

        $section = $this->doc->addSection();
        $section->addTitle($this->localizeHeading(count($this->ids) > 1 ? 'user_profiles' : 'user_profile'), 1);

        User::with([
            'department',
            'currentClassification',
            'experiences' => ['userSkills' => ['skill']],
            'userSkills' => ['skill'],
        ])
            ->whereIn('id', $this->ids)
            ->authorizedToView(['userId' => $this->userId])
            ->chunk(200, function ($users) use ($section) {
                foreach ($users as $user) {
                    $this->generateUser($section, $user);
                }
            });

        return $this;
    }
}
