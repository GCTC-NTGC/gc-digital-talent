<?php

namespace Tests\Unit\Generators;

use App\Enums\Language;
use App\Generators\Field\Field;
use App\Generators\NominationsExcelGenerator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class FieldRendererTest extends TestCase
{
    private function renderer(?string $lang = 'en'): NominationsExcelGenerator
    {
        return new NominationsExcelGenerator(
            fileName: 'nominations',
            talentNominationEventId: 'talent-nomination-event',
            dir: 'test',
            lang: $lang
        );
    }

    public function testTextFieldFlattensNewLines(): void
    {
        $field = Field::text('heading', fn ($context) => "first\r\nsecond\nthird");

        $this->assertEquals('first  second third', $this->renderer()->render($field, null));
    }

    public function testAccessorReceivesTheContext(): void
    {
        $field = Field::text('heading', fn ($context) => $context['name']);

        $this->assertEquals('Nominee', $this->renderer()->render($field, ['name' => 'Nominee']));
    }

    public function testHtmlFieldStripsTagsAndNewLines(): void
    {
        $field = Field::html('heading', fn ($context) => "<p>first</p>\n<ul><li>second</li></ul>");

        $this->assertEquals('first second', $this->renderer()->render($field, null));
    }

    public function testHtmlFieldLeavesEntitiesEncoded(): void
    {
        $field = Field::html('heading', fn ($context) => '<p>Ready &amp; willing</p>');

        $this->assertEquals('Ready &amp; willing', $this->renderer()->render($field, null));
    }

    public function testNumberFieldRendersZero(): void
    {
        $renderer = $this->renderer();

        $this->assertEquals('0', $renderer->render(Field::number('heading', fn ($context) => 0), null));
        $this->assertEquals('1.5', $renderer->render(Field::number('heading', fn ($context) => 1.5), null));
        $this->assertEquals('04', $renderer->render(Field::number('heading', fn ($context) => '04'), null));
    }

    public function testBoolFieldRendersFalseAsNo(): void
    {
        $renderer = $this->renderer();

        $this->assertEquals(__('common.yes'), $renderer->render(Field::bool('heading', fn ($context) => true), null));
        $this->assertEquals(__('common.no'), $renderer->render(Field::bool('heading', fn ($context) => false), null));
    }

    public function testBoolFieldRendersInTheRequestedLanguage(): void
    {
        $field = Field::bool('heading', fn ($context) => false);

        $this->assertEquals('Non', $this->renderer('fr')->render($field, null));
    }

    public function testNullValueRendersTheDefault(): void
    {
        $field = Field::text('heading', fn ($context) => null);
        $renderer = $this->renderer();

        $this->assertEquals('', $renderer->render($field, null));
        $this->assertEquals('N/A', $renderer->render($field, null, 'N/A'));
    }

    public function testEnumFieldLocalizesCaseInsensitively(): void
    {
        $upper = Field::enum('heading', Language::class, fn ($context) => Language::EN->name);
        $lower = Field::enum('heading', Language::class, fn ($context) => 'en');

        $this->assertEquals('English', $this->renderer()->render($upper, null));
        $this->assertEquals('English', $this->renderer()->render($lower, null));
        $this->assertEquals('Anglais', $this->renderer('fr')->render($upper, null));
    }

    public function testEnumFieldSanitizesAValueOutsideTheEnum(): void
    {
        $field = Field::enum('heading', Language::class, fn ($context) => 'SOME_OTHER_VALUE');

        $this->assertEquals('Some Other Value', $this->renderer()->render($field, null));
    }

    public function testEnumFieldRendersTheDefaultForAMissingEnumClass(): void
    {
        $field = Field::enum('heading', 'App\Enums\NotARealEnum', fn ($context) => Language::EN->name);

        $this->assertEquals('unknown', $this->renderer()->render($field, null, 'unknown'));
    }

    public function testEnumFieldJoinsAListOfCases(): void
    {
        $field = Field::enum('heading', Language::class, fn ($context) => [Language::EN->name, Language::FR->name]);

        $this->assertEquals('English, French', $this->renderer()->render($field, null));
    }

    public function testEnumFieldRendersAnEmptyListAsAnEmptyString(): void
    {
        $field = Field::enum('heading', Language::class, fn ($context) => []);

        $this->assertEquals('', $this->renderer()->render($field, null, 'unknown'));
    }

    public function testEnumFieldSkipsUnlocalizableCasesInAList(): void
    {
        $field = Field::enum('heading', 'App\Enums\NotARealEnum', fn ($context) => [Language::EN->name, Language::FR->name]);

        $this->assertEquals('', $this->renderer()->render($field, null));
    }

    public function testDateFieldFormatsStringsAndCarbonInstances(): void
    {
        $renderer = $this->renderer();
        $fromString = Field::date('heading', 'Y', fn ($context) => '2024-03-05 14:30:00');
        $fromCarbon = Field::date('heading', 'Y-m-d', fn ($context) => new Carbon('2024-03-05 14:30:00'));

        $this->assertEquals('2024', $renderer->render($fromString, null));
        $this->assertEquals('2024-03-05', $renderer->render($fromCarbon, null));
    }

    public function testDateFieldRendersTheDefaultForANonDateValue(): void
    {
        $field = Field::date('heading', 'Y-m-d', fn ($context) => 20240305);

        $this->assertEquals('none', $this->renderer()->render($field, null, 'none'));
    }

    public function testVisibleRendersNotAvailableWithoutAFallback(): void
    {
        $field = Field::text('heading', fn ($context) => 'secret')
            ->visible(fn ($context) => false);

        $this->assertEquals(__('common.not_available'), $this->renderer()->render($field, null));
    }

    public function testVisibleRendersNonDisponibleInFrench(): void
    {
        $field = Field::text('heading', fn ($context) => 'secret')
            ->visible(fn ($context) => false);

        $this->assertEquals('Non disponible', $this->renderer('fr')->render($field, null));
    }

    public function testVisibleRendersTheProvidedFallback(): void
    {
        $field = Field::text('heading', fn ($context) => 'secret')
            ->visible(fn ($context) => false, '');

        $this->assertEquals('', $this->renderer()->render($field, null));
    }

    public function testVisibleRendersTheValueWhenTheConditionPasses(): void
    {
        $field = Field::text('heading', fn ($context) => 'secret')
            ->visible(fn ($context) => $context['consented']);

        $this->assertEquals('secret', $this->renderer()->render($field, ['consented' => true]));
    }

    public function testVisibleReturnsANewFieldAndLeavesTheOriginalRendering(): void
    {
        $field = Field::text('heading', fn ($context) => 'secret');
        $guarded = $field->visible(fn ($context) => false);
        $renderer = $this->renderer();

        $this->assertNotSame($field, $guarded);
        $this->assertEquals('secret', $renderer->render($field, null));
        $this->assertEquals(__('common.not_available'), $renderer->render($guarded, null));
    }

    public function testChainedVisibleKeepsOnlyTheLastCondition(): void
    {
        $renderer = $this->renderer();
        $lastConditionFails = Field::text('heading', fn ($context) => 'secret')
            ->visible(fn ($context) => true)
            ->visible(fn ($context) => false, 'hidden');
        $lastConditionPasses = Field::text('heading', fn ($context) => 'secret')
            ->visible(fn ($context) => false, 'hidden')
            ->visible(fn ($context) => true);

        $this->assertEquals('hidden', $renderer->render($lastConditionFails, null));
        $this->assertEquals('secret', $renderer->render($lastConditionPasses, null));
    }

    public function testFailedAccessorRendersTheDefaultAndLogsOnce(): void
    {
        Log::shouldReceive('channel')->once()->with('jobs')->andReturnSelf();
        Log::shouldReceive('warning')->once();

        $field = Field::text('heading', fn ($context) => $context->missingProperty);
        $renderer = $this->renderer();

        $this->assertEquals('none', $renderer->render($field, null, 'none'));
        $this->assertEquals('none', $renderer->render($field, null, 'none'));
    }

    public function testUnparsableDateLogsAndRendersTheDefault(): void
    {
        Log::shouldReceive('channel')->once()->with('jobs')->andReturnSelf();
        Log::shouldReceive('warning')->once();

        $field = Field::date('heading', 'Y-m-d', fn ($context) => 'not a date');

        $this->assertEquals('', $this->renderer()->render($field, null));
    }

    public function testEachFailingFieldHeadingLogsSeparately(): void
    {
        Log::shouldReceive('channel')->twice()->with('jobs')->andReturnSelf();
        Log::shouldReceive('warning')->twice();

        $renderer = $this->renderer();
        $first = Field::text('first_heading', fn ($context) => $context->missingProperty);
        $second = Field::text('second_heading', fn ($context) => $context->missingProperty);

        $this->assertEquals('', $renderer->render($first, null));
        $this->assertEquals('', $renderer->render($second, null));
    }

    public function testFailedVisibleConditionRendersTheDefault(): void
    {
        Log::shouldReceive('channel')->once()->with('jobs')->andReturnSelf();
        Log::shouldReceive('warning')->once();

        $field = Field::text('heading', fn ($context) => 'secret')
            ->visible(fn ($context) => $context->missingProperty);

        $this->assertEquals('none', $this->renderer()->render($field, null, 'none'));
    }
}
