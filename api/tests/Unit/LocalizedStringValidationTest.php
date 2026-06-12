<?php

namespace Tests\Unit;

use App\Rules\LocalizedString;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class LocalizedStringValidationTest extends TestCase
{
    #[DataProvider('validationProvider')]
    public function testLocalizedStringValidation(mixed $value, bool $passes): void
    {
        $data = ['test' => $value];

        $validator = Validator::make($data, ['test' => [new LocalizedString()]]);
        $isValid = $validator->passes();

        if ($passes) {
            $this->assertTrue($isValid);
        } else {
            $this->assertFalse($isValid);
        }
    }

    public static function validationProvider(): array
    {
        return [
            'valid localized string' => [['en' => 'English text', 'fr' => 'Texte francais'], true],
            'must be an array' => ['not-an-array', false],
            'requires en key' => [['fr' => 'Texte francais'], false],
            'requires fr key' => [['en' => 'English text'], false],
            'only en and fr keys allowed' => [['en' => 'English text', 'fr' => 'Texte francais', 'es' => 'Texto'], false],
            'en must be a string' => [['en' => 123, 'fr' => 'Texte francais'], false],
            'fr must be a string' => [['en' => 'English text', 'fr' => 123], false],
        ];
    }
}
