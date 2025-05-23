<?php

namespace Tests\Unit;

use App\Models\PoolCandidate;
use App\Traits\Generator\Filterable;
use Illuminate\Support\Arr;
use Tests\TestCase;

class FilterableTraitTest extends TestCase
{
    protected $trait;

    protected function setUp(): void
    {
        $this->trait = new class
        {
            use Filterable;

            public function testFlatten(array $filters)
            {
                return $this->flattenFilters($filters);
            }
        };

        parent::setUp();
    }

    /**
     * @dataProvider flattenProvider
     */
    public function testFlattensFilters(array $filters, array $expected): void
    {
        $results = $this->trait->testFlatten($filters);

        $this->assertEquals($expected, $results);
    }

    /**
     * @dataProvider applyProvider
     */
    public function testApplyFilters(array $filters, array $scopeMap, $expected): void
    {

        $model = new class extends PoolCandidate
        {
            private $calledScopes = [];

            public function callNamedScope($scope, array $parameters = [])
            {
                $this->calledScopes[] = $scope;

                return $this;
            }

            public function getCalledScopes()
            {
                return $this->calledScopes;
            }
        };

        $query = $model::query();

        $this->trait
            ->debug(true)
            ->setFilters($filters)
            ->applyFilters($query, $scopeMap);

        $calledScopes = $query->getModel()->getCalledScopes();
        $calledScopes = Arr::flatten([...$calledScopes, Arr::map($this->trait->calledFilters, fn ($filter) => $filter['scope'])]);

        foreach ($expected as $key => $contains) {
            if (! $contains) {
                $this->assertNotContains($key, $calledScopes ?? []);
            } else {
                $this->assertContains($key, $calledScopes ?? []);
            }
        }

    }

    public static function flattenProvider()
    {
        return [
            'does not flatten lists' => [
                [
                    'assoc' => ['filter' => 'value'],
                    'list' => ['value_one', 'value_true'],
                ],
                [
                    'filter' => 'value',
                    'list' => ['value_one', 'value_true'],
                ],
            ],
            'flattens deeply nested' => [
                [
                    'one' => [
                        'two' => [
                            'three' => [
                                'four' => 'levels',
                            ],
                        ],
                    ],
                ],
                [
                    'four' => 'levels',
                ],
            ],
            'ignores equity filter' => [
                [
                    'not_equity' => [
                        'nested_true' => true,
                        'nested_false' => false,
                        'equity' => [
                            'nested_equity' => true,
                        ],
                    ],
                ],
                [
                    'nested_true' => true,
                    'nested_false' => false,
                    'equity' => [
                        'nested_equity' => true,
                    ],
                ],
            ],
        ];
    }

    public static function applyProvider()
    {
        return [
            'does not apply non-existent scopes' => [
                ['not_real' => 'value'],
                [],
                ['not_real' => false],
            ],
            'ignores null values' => [
                ['whereEmail' => null],
                [],
                ['whereEmail' => false],
            ],
            'calls top level scopes' => [
                ['whereEmail' => 'email@test.com'],
                [],
                ['whereEmail' => true],
            ],
            'calls nested scopes' => [
                ['applicantFilter' => ['whereIsGovEmployee' => true]],
                [],
                ['whereIsGovEmployee' => true],
            ],
            'calls mapped scopes' => [
                ['skills' => ['id']],
                ['skills' => 'whereSkillsAdditive'],
                ['whereSkillsAdditive' => true],
            ],
        ];
    }
}
