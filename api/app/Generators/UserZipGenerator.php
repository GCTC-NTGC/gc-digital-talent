<?php

namespace App\Generators;

use App\Models\User;

class UserZipGenerator extends ZipGenerator implements FileGeneratorInterface
{
    public function __construct(protected array $ids, protected bool $anonymous, public string $fileName, public ?string $dir, protected ?string $lang)
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        User::with([
            'department',
            'currentClassification',
            'experiences' => ['userSkills', 'userSkills.skill'],
            'userSkills' => ['skill'],
        ])
            ->whereIn('id', $this->ids)
            ->whereAuthorizedToView(['userId' => $this->userId])
            ->chunk(200, function ($users) {
                foreach ($users as $user) {
                    $generator = new UserDocGenerator(
                        user: $user,
                        anonymous: $this->anonymous,
                        dir: $this->dir,
                        lang: $this->lang
                    );

                    $this->incrementFileName($generator)->generate()->write();
                    $this->addFile($generator);
                }
            });

        return $this;
    }
}
