<?php

namespace Tests\Unit;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Model;
use Tests\TestCase;

class LocalizedStringCastTest extends TestCase
{
    public function testSetReturnsNullForNullInput(): void
    {
        $cast = new LocalizedString();
        $model = new class() extends Model {};

        $result = $cast->set($model, 'custom_instructions', null, []);

        $this->assertNull($result);
    }

    public function testSetEncodesArrayInput(): void
    {
        $cast = new LocalizedString();
        $model = new class() extends Model {};

        $result = $cast->set($model, 'custom_instructions', ['en' => 'Hello', 'fr' => 'Bonjour'], []);

        $this->assertSame('{"en":"Hello","fr":"Bonjour"}', $result);
    }

    public function testGetReturnsNullForStringNull(): void
    {
        $cast = new LocalizedString();
        $model = new class() extends Model {};

        $result = $cast->get($model, 'custom_instructions', 'null', []);

        $this->assertNull($result);
    }
}
