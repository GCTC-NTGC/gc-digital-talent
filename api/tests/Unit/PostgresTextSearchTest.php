<?php

namespace Tests\Unit;

use App\Utilities\PostgresTextSearch;
use App\Utilities\PostgresTextSearchMatchingType;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PostgresTextSearchTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
    }

    #[DataProvider('tsQueryBuilderProvider')]
    public function testBuildTsQuery(string $matchingType, string $searchString, string $expectedOutput)
    {
        $actualOutput = PostgresTextSearch::searchStringToQueryText($searchString, PostgresTextSearchMatchingType::{$matchingType});
        $this->assertEquals($expectedOutput, $actualOutput);
    }

    public static function tsQueryBuilderProvider()
    {

        return [
            'prefix, single term' => [
                'matchingType' => 'PREFIX',
                'searchString' => 'term',
                'expectedOutput' => 'term:*',
            ],
            'exact, single term' => [
                'matchingType' => 'EXACT',
                'searchString' => 'term',
                'expectedOutput' => 'term',
            ],
            'prefix, multiple terms with extra spacing' => [
                'matchingType' => 'PREFIX',
                'searchString' => ' term1   term2        term3        ',
                'expectedOutput' => 'term1:* & term2:* & term3:*',
            ],
            'exact, multiple terms with extra spacing' => [
                'matchingType' => 'EXACT',
                'searchString' => ' term1   term2        term3        ',
                'expectedOutput' => 'term1 & term2 & term3',
            ],
            'prefix, negation with dash' => [
                'matchingType' => 'PREFIX',
                'searchString' => 'term1 -term2',
                'expectedOutput' => 'term1:* & !term2:*',
            ],
            'exact, negation with dash' => [
                'matchingType' => 'EXACT',
                'searchString' => 'term1 -term2',
                'expectedOutput' => 'term1 & !term2',
            ],
            'prefix, explicit and-ing' => [
                'matchingType' => 'PREFIX',
                'searchString' => 'term1 AND term2',
                'expectedOutput' => 'term1:* & term2:*',
            ],
            'exact, explicit and-ing' => [
                'matchingType' => 'EXACT',
                'searchString' => 'term1 AND term2',
                'expectedOutput' => 'term1 & term2',
            ],
            'prefix, explicit or-ing' => [
                'matchingType' => 'PREFIX',
                'searchString' => 'term1 OR term2',
                'expectedOutput' => 'term1:* | term2:*',
            ],
            'exact, explicit or-ing' => [
                'matchingType' => 'EXACT',
                'searchString' => 'term1 OR term2',
                'expectedOutput' => 'term1 | term2',
            ],
            'prefix, quotes' => [
                'matchingType' => 'PREFIX',
                'searchString' => ' term1 "term2 term3"   "term4 term5" term6',
                'expectedOutput' => 'term1:* & term2:* <-> term3:* & term4:* <-> term5:* & term6:*',
            ],
            'exact, quotes' => [
                'matchingType' => 'EXACT',
                'searchString' => ' term1 "term2 term3"   "term4 term5" term6',
                'expectedOutput' => 'term1 & term2 <-> term3 & term4 <-> term5 & term6',
            ],
            'prefix, quote followed by or' => [
                'matchingType' => 'PREFIX',
                'searchString' => '"term1" OR term2',
                'expectedOutput' => 'term1:* | term2:*',
            ],
            'exact, quote followed by or' => [
                'matchingType' => 'EXACT',
                'searchString' => '"term1" OR term2',
                'expectedOutput' => 'term1 | term2',
            ],
            'prefix, removes terms with invalid patterns' => [
                'matchingType' => 'PREFIX',
                'searchString' => "term1& &term2 term3| |term4 :term5 te:rm6 term7: term!8 term9! ! ( ) < > term10'",
                'expectedOutput' => '',
            ],
            'exact, removes terms with invalid patterns' => [
                'matchingType' => 'EXACT',
                'searchString' => "term1& &term2 term3| |term4 :term5 te:rm6 term7: term!8 term9! ! ( ) < > term10'",
                'expectedOutput' => '',
            ],
            'prefix, allows terms with valid patterns' => [
                'matchingType' => 'PREFIX',
                'searchString' => "te&rm1 te|rm2 !term3 'term4 te'rm5",
                'expectedOutput' => "te&rm1:* & te|rm2:* & !term3:* & 'term4:* & te'rm5:*",
            ],
            'exact, allows terms with valid patterns' => [
                'matchingType' => 'EXACT',
                'searchString' => "te&rm1 te|rm2 !term3 'term4 te'rm5",
                'expectedOutput' => "te&rm1 & te|rm2 & !term3 & 'term4 & te'rm5",
            ],
        ];
    }
}
