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
            'en and fr can be null' => [['en' => null, 'fr' => null], true],
            'en and fr can both be empty strings' => [['en' => '', 'fr' => ''], true],
            'en can be null only if fr is also null or empty' => [['en' => null, 'fr' => 'Texte francais'], false],
            'fr can be null only if en is also null or empty' => [['en' => 'English text', 'fr' => null], false],
            'en cannot be empty if fr is filled' => [['en' => '', 'fr' => 'Texte francais'], false],
            'fr cannot be empty if en is filled' => [['en' => 'English text', 'fr' => ''], false],
            'must be an array' => ['not-an-array', false],
            'requires en key' => [['fr' => 'Texte francais'], false],
            'requires fr key' => [['en' => 'English text'], false],
            'only en and fr keys allowed' => [['en' => 'English text', 'fr' => 'Texte francais', 'es' => 'Texto'], false],
            'en must be a string' => [['en' => 123, 'fr' => 'Texte francais'], false],
            'fr must be a string' => [['en' => 'English text', 'fr' => 123], false],
        ];
    }

    public function testLocalizedStringCanRequireBothValues(): void
    {
        $validator = Validator::make(
            ['test' => ['en' => null, 'fr' => null]],
            ['test' => ['localized_string:required']]
        );

        $this->assertFalse($validator->passes());
    }

    public function testLocalizedStringCanValidateBothValuesAsUrls(): void
    {
        $validUrls = Validator::make(
            ['test' => ['en' => 'https://example.com/en', 'fr' => 'https://example.com/fr']],
            ['test' => ['localized_string:url']]
        );
        $invalidUrls = Validator::make(
            ['test' => ['en' => 'https://example.com/en', 'fr' => 'not-a-url']],
            ['test' => ['localized_string:url']]
        );

        $this->assertTrue($validUrls->passes());
        $this->assertFalse($invalidUrls->passes());
    }
}
