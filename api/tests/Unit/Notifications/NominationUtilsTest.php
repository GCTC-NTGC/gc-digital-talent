<?php

namespace Tests\Unit\Notifications;

use App\Notifications\Utils\NominationUtils;
use Tests\TestCase;

class NominationUtilsTest extends TestCase
{
    /**
     * @dataProvider statusProvider
     */
    public function testCombineNominationOptionDescriptions($parameters, $expectedResult)
    {
        $actualResult = NominationUtils::combineNominationOptionDescriptions(...$parameters);

        $this->assertEquals($expectedResult, $actualResult);
    }

    public static function statusProvider()
    {
        return [
            'none, English' => [
                [
                    'locale' => 'en',
                    'nominateForAdvancement' => false,
                    'nominateForLateralMovement' => false,
                    'nominateForDevelopmentPrograms' => false,
                ],
                'Not provided',
            ],
            'none, French' => [
                [
                    'locale' => 'fr',
                    'nominateForAdvancement' => false,
                    'nominateForLateralMovement' => false,
                    'nominateForDevelopmentPrograms' => false,
                ],
                'Renseignements manquants',
            ],
            'one, English' => [
                [
                    'locale' => 'en',
                    'nominateForAdvancement' => true,
                    'nominateForLateralMovement' => false,
                    'nominateForDevelopmentPrograms' => false,
                ],
                'advancement',
            ],
            'one, French' => [
                [
                    'locale' => 'fr',
                    'nominateForAdvancement' => true,
                    'nominateForLateralMovement' => false,
                    'nominateForDevelopmentPrograms' => false,
                ],
                'avancement',
            ],
            'two, English' => [
                [
                    'locale' => 'en',
                    'nominateForAdvancement' => true,
                    'nominateForLateralMovement' => true,
                    'nominateForDevelopmentPrograms' => false,
                ],
                'advancement and lateral movement',
            ],
            'two, French' => [
                [
                    'locale' => 'fr',
                    'nominateForAdvancement' => true,
                    'nominateForLateralMovement' => true,
                    'nominateForDevelopmentPrograms' => false,
                ],
                'avancement et mutation latérale',
            ],
            'three, English' => [
                [
                    'locale' => 'en',
                    'nominateForAdvancement' => true,
                    'nominateForLateralMovement' => true,
                    'nominateForDevelopmentPrograms' => true,
                ],
                'advancement, lateral movement, and development program',
            ],
            'three, French' => [
                [
                    'locale' => 'fr',
                    'nominateForAdvancement' => true,
                    'nominateForLateralMovement' => true,
                    'nominateForDevelopmentPrograms' => true,
                ],
                'avancement, mutation latérale et programme de perfectionnement',
            ],
        ];
    }
}
