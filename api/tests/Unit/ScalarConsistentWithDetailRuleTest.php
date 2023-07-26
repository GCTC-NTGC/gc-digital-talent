<?php

namespace Tests\Unit;

use App\Rules\ScalarConsistentWithDetail;
use Illuminate\Support\Arr;
use Tests\TestCase;

use function PHPUnit\Framework\assertFalse;
use function PHPUnit\Framework\assertTrue;

class ScalarConsistentWithDetailRuleTest extends TestCase
{
    // https://freek.dev/2415-how-to-test-laravels-invokable-rules
    private function runTestOnRule(ScalarConsistentWithDetail $rule, array $data, string $fieldName): bool
    {
        $isValid = true;
        $rule->setData($data);
        $rule->validate(
            $fieldName,
            Arr::get($data, $fieldName),
            function () use (&$isValid) {
                $isValid = false;
            }
        );
        return $isValid;
    }

    public function testRulePassesWithoutDetail()
    {
        $data = [
            'primaryField' => 'VAL1',
            'otherField' => null,
        ];
        $rule = new ScalarConsistentWithDetail('OTHER', 'otherField');
        $isValid = $this->runTestOnRule($rule, $data, 'primaryField');
        assertTrue($isValid, 'Expected rule to pass but it didn\'t');
    }
    public function testRulePassesWithDetail()
    {
        $data = [
            'primaryField' => 'OTHER',
            'otherField' => 'other value',
        ];
        $rule = new ScalarConsistentWithDetail('OTHER', 'otherField');
        $isValid = $this->runTestOnRule($rule, $data, 'primaryField');
        assertTrue($isValid, 'Expected rule to pass but it didn\'t');
    }
    public function testRuleFailsWithMissingDetail()
    {
        $data = [
            'primaryField' => 'OTHER',
        ];
        $rule = new ScalarConsistentWithDetail('OTHER', 'otherField');
        $isValid = $this->runTestOnRule($rule, $data, 'primaryField');
        assertFalse($isValid, 'Expected rule to fail but it didn\'t');
    }
    public function testRuleFailsWithEmptyDetail()
    {
        $data = [
            'primaryField' => 'OTHER',
            'otherField' => '',
        ];
        $rule = new ScalarConsistentWithDetail('OTHER', 'otherField');
        $isValid = $this->runTestOnRule($rule, $data, 'primaryField');
        assertFalse($isValid, 'Expected rule to fail but it didn\'t');
    }
    public function testRuleFailsWithSuperfluousDetail()
    {
        $data = [
            'primaryField' => 'VAL1',
            'otherField' => 'other value',
        ];
        $rule = new ScalarConsistentWithDetail('OTHER', 'otherField');
        $isValid = $this->runTestOnRule($rule, $data, 'primaryField');
        assertFalse($isValid, 'Expected rule to fail but it didn\'t');
    }
    public function testRuleFailsWithMissingPrimary()
    {
        $data = [
            'otherField' => 'other value',
        ];
        $rule = new ScalarConsistentWithDetail('OTHER', 'otherField');
        $isValid = $this->runTestOnRule($rule, $data, 'primaryField');
        assertFalse($isValid, 'Expected rule to fail but it didn\'t');
    }
    public function testRulePassesWithoutDetailNested()
    {
        $data = [
            'deep' => [
                'primaryField' => 'VAL1',
                'otherField' => null,
            ]
        ];
        $rule = new ScalarConsistentWithDetail('OTHER', 'otherField');
        $isValid = $this->runTestOnRule($rule, $data, 'deep.primaryField');
        assertTrue($isValid, 'Expected rule to pass but it didn\'t');
    }
    public function testRulePassesWithDetailNested()
    {
        $data = [
            'deep' => [
                'primaryField' => 'OTHER',
                'otherField' => 'other value',
            ]
        ];
        $rule = new ScalarConsistentWithDetail('OTHER', 'otherField');
        $isValid = $this->runTestOnRule($rule, $data, 'deep.primaryField');
        assertTrue($isValid, 'Expected rule to pass but it didn\'t');
    }
}
