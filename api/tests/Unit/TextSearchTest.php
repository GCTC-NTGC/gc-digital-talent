<?php

namespace Tests\Unit;

use App\Models\User;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class TextSearchTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
    }

    #[DataProvider('tsQueryBuilderProvider')]
    public function testBuildTsQuery(string $searchString, string $expectedOutput)
    {
        $actualOutput = User::searchStringToTsQuery($searchString);
        $this->assertEquals($expectedOutput, $actualOutput);
    }

    public static function tsQueryBuilderProvider()
    {

        return [
            'single term' => [
                'searchString' => 'term',
                'expectedOutput' => 'term:*',
            ],
            'multiple terms with extra spacing' => [
                'searchString' => ' term1   term2        term3        ',
                'expectedOutput' => 'term1:* & term2:* & term3:*',
            ],
            'negation with dash' => [
                'searchString' => 'term1 -term2',
                'expectedOutput' => 'term1:* & !term2:*',
            ],
            'explicit and-ing' => [
                'searchString' => 'term1 AND term2',
                'expectedOutput' => 'term1:* & term2:*',
            ],
            'explicit or-ing' => [
                'searchString' => 'term1 OR term2',
                'expectedOutput' => 'term1:* | term2:*',
            ],
            'quotes' => [
                'searchString' => ' term1 "term2 term3"   "term4 term5" term6',
                'expectedOutput' => 'term1:* & term2:* <-> term3:* & term4:* <-> term5:* & term6:*',
            ],
        ];
    }
}
