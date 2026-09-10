<?php

namespace Tests\Unit\Generators;

use App\Enums\Language;
use App\Generators\Field\BoolField;
use App\Generators\Field\DateField;
use App\Generators\Field\EnumField;
use App\Generators\Field\HtmlField;
use App\Generators\Field\NumberField;
use App\Generators\Field\TextField;
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
        $field = new TextField('heading', fn ($context) => "first\r\nsecond\nthird");

        $this->assertEquals('first  second third', $this->renderer()->render($field, null));
    }

    public function testAccessorReceivesTheContext(): void
    {
        $field = new TextField('heading', fn ($context) => $context['name']);

        $this->assertEquals('Nominee', $this->renderer()->render($field, ['name' => 'Nominee']));
    }

    public function testHtmlFieldStripsTagsAndNewLines(): void
    {
        $field = new HtmlField('heading', fn ($context) => "<p>first</p>\n<ul><li>second</li></ul>");

        $this->assertEquals('first second', $this->renderer()->render($field, null));
    }

    public function testHtmlFieldLeavesEntitiesEncoded(): void
    {
        $field = new HtmlField('heading', fn ($context) => '<p>Ready &amp; willing</p>');

        $this->assertEquals('Ready &amp; willing', $this->renderer()->render($field, null));
    }

    public function testNumberFieldRendersZero(): void
    {
        $renderer = $this->renderer();

        $this->assertEquals('0', $renderer->render(new NumberField('heading', fn ($context) => 0), null));
        $this->assertEquals('1.5', $renderer->render(new NumberField('heading', fn ($context) => 1.5), null));
        $this->assertEquals('04', $renderer->render(new NumberField('heading', fn ($context) => '04'), null));
    }

    public function testBoolFieldRendersFalseAsNo(): void
    {
        $renderer = $this->renderer();

        $this->assertEquals(__('common.yes'), $renderer->render(new BoolField('heading', fn ($context) => true), null));
        $this->assertEquals(__('common.no'), $renderer->render(new BoolField('heading', fn ($context) => false), null));
    }

    public function testBoolFieldRendersInTheRequestedLanguage(): void
    {
        $field = new BoolField('heading', fn ($context) => false);

        $this->assertEquals('Non', $this->renderer('fr')->render($field, null));
    }

    public function testNullValueRendersTheDefault(): void
    {
        $field = new TextField('heading', fn ($context) => null);
        $renderer = $this->renderer();

        $this->assertEquals('', $renderer->render($field, null));
        $this->assertEquals('N/A', $renderer->render($field, null, 'N/A'));
    }

    public function testEnumFieldLocalizesCaseInsensitively(): void
    {
        $upper = new EnumField('heading', Language::class, fn ($context) => Language::EN->name);
        $lower = new EnumField('heading', Language::class, fn ($context) => 'en');

        $this->assertEquals('English', $this->renderer()->render($upper, null));
        $this->assertEquals('English', $this->renderer()->render($lower, null));
        $this->assertEquals('Anglais', $this->renderer('fr')->render($upper, null));
    }

    public function testEnumFieldSanitizesAValueOutsideTheEnum(): void
    {
        $field = new EnumField('heading', Language::class, fn ($context) => 'SOME_OTHER_VALUE');

        $this->assertEquals('Some Other Value', $this->renderer()->render($field, null));
    }

    public function testEnumFieldRendersTheDefaultForAMissingEnumClass(): void
    {
        $field = new EnumField('heading', 'App\Enums\NotARealEnum', fn ($context) => Language::EN->name);

        $this->assertEquals('unknown', $this->renderer()->render($field, null, 'unknown'));
    }

    public function testEnumFieldJoinsAListOfCases(): void
    {
        $field = new EnumField('heading', Language::class, fn ($context) => [Language::EN->name, Language::FR->name]);

        $this->assertEquals('English, French', $this->renderer()->render($field, null));
    }

    public function testEnumFieldRendersAnEmptyListAsAnEmptyString(): void
    {
        $field = new EnumField('heading', Language::class, fn ($context) => []);

        $this->assertEquals('', $this->renderer()->render($field, null, 'unknown'));
    }

    public function testEnumFieldSkipsUnlocalizableCasesInAList(): void
    {
        $field = new EnumField('heading', 'App\Enums\NotARealEnum', fn ($context) => [Language::EN->name, Language::FR->name]);

        $this->assertEquals('', $this->renderer()->render($field, null));
    }

    public function testDateFieldFormatsStringsAndCarbonInstances(): void
    {
        $renderer = $this->renderer();
        $fromString = new DateField('heading', 'Y', fn ($context) => '2024-03-05 14:30:00');
        $fromCarbon = new DateField('heading', 'Y-m-d', fn ($context) => new Carbon('2024-03-05 14:30:00'));

        $this->assertEquals('2024', $renderer->render($fromString, null));
        $this->assertEquals('2024-03-05', $renderer->render($fromCarbon, null));
    }

    public function testDateFieldRendersTheDefaultForANonDateValue(): void
    {
        $field = new DateField('heading', 'Y-m-d', fn ($context) => 20240305);

        $this->assertEquals('none', $this->renderer()->render($field, null, 'none'));
    }

    public function testVisibleRendersNotAvailableWithoutAFallback(): void
    {
        $field = new TextField('heading', fn ($context) => 'secret')
            ->visibleIf(fn ($context) => false);

        $this->assertEquals(__('common.not_available'), $this->renderer()->render($field, null));
    }

    public function testVisibleRendersNonDisponibleInFrench(): void
    {
        $field = new TextField('heading', fn ($context) => 'secret')
            ->visibleIf(fn ($context) => false);

        $this->assertEquals('Non disponible', $this->renderer('fr')->render($field, null));
    }

    public function testVisibleRendersTheProvidedFallback(): void
    {
        $field = new TextField('heading', fn ($context) => 'secret')
            ->visibleIf(fn ($context) => false, '');

        $this->assertEquals('', $this->renderer()->render($field, null));
    }

    public function testVisibleRendersTheValueWhenTheConditionPasses(): void
    {
        $field = new TextField('heading', fn ($context) => 'secret')
            ->visibleIf(fn ($context) => $context['consented']);

        $this->assertEquals('secret', $this->renderer()->render($field, ['consented' => true]));
    }

    public function testVisibleReturnsANewFieldAndLeavesTheOriginalRendering(): void
    {
        $field = new TextField('heading', fn ($context) => 'secret');
        $guarded = $field->visibleIf(fn ($context) => false);
        $renderer = $this->renderer();

        $this->assertNotSame($field, $guarded);
        $this->assertEquals('secret', $renderer->render($field, null));
        $this->assertEquals(__('common.not_available'), $renderer->render($guarded, null));
    }

    public function testChainedVisibleKeepsOnlyTheLastCondition(): void
    {
        $renderer = $this->renderer();
        $lastConditionFails = new TextField('heading', fn ($context) => 'secret')
            ->visibleIf(fn ($context) => true)
            ->visibleIf(fn ($context) => false, 'hidden');
        $lastConditionPasses = new TextField('heading', fn ($context) => 'secret')
            ->visibleIf(fn ($context) => false, 'hidden')
            ->visibleIf(fn ($context) => true);

        $this->assertEquals('hidden', $renderer->render($lastConditionFails, null));
        $this->assertEquals('secret', $renderer->render($lastConditionPasses, null));
    }

    public function testFailedAccessorRendersTheDefaultAndLogsOnce(): void
    {
        Log::shouldReceive('channel')->once()->with('jobs')->andReturnSelf();
        Log::shouldReceive('error')->once();

        $field = new TextField('heading', fn ($context) => $context->missingProperty);
        $renderer = $this->renderer();

        $this->assertEquals('none', $renderer->render($field, null, 'none'));
        $this->assertEquals('none', $renderer->render($field, null, 'none'));
    }

    public function testUnparsableDateLogsAndRendersTheDefault(): void
    {
        Log::shouldReceive('channel')->once()->with('jobs')->andReturnSelf();
        Log::shouldReceive('error')->once();

        $field = new DateField('heading', 'Y-m-d', fn ($context) => 'not a date');

        $this->assertEquals('', $this->renderer()->render($field, null));
    }

    public function testEachFailingFieldHeadingLogsSeparately(): void
    {
        Log::shouldReceive('channel')->twice()->with('jobs')->andReturnSelf();
        Log::shouldReceive('error')->twice();

        $renderer = $this->renderer();
        $first = new TextField('first_heading', fn ($context) => $context->missingProperty);
        $second = new TextField('second_heading', fn ($context) => $context->missingProperty);

        $this->assertEquals('', $renderer->render($first, null));
        $this->assertEquals('', $renderer->render($second, null));
    }

    public function testFailedVisibleConditionRendersTheDefault(): void
    {
        Log::shouldReceive('channel')->once()->with('jobs')->andReturnSelf();
        Log::shouldReceive('error')->once();

        $field = new TextField('heading', fn ($context) => 'secret')
            ->visibleIf(fn ($context) => $context->missingProperty);

        $this->assertEquals('none', $this->renderer()->render($field, null, 'none'));
    }
}
