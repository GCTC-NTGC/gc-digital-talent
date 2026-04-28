<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use Nuwave\Lighthouse\Validation\Validator;

final class SitewideAnnouncementInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'isEnabled' => ['boolean'],
            'isDismissible' => ['boolean'],
            'title.en' => ['required', 'string'],
            'title.fr' => ['required', 'string'],
            'message.en' => ['required', 'string'],
            'message.fr' => ['required', 'string'],
            'publishDate' => ['required', 'date'],
            'expiryDate' => ['required', 'date', 'after:publishDate'],
        ];
    }
}
