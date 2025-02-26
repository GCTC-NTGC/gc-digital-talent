<?php

namespace Tests\Unit;

use App\Rules\GovernmentEmail;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class GovernmentEmailValidationTest extends TestCase
{
    /**
     * @dataProvider validationProvider
     */
    public function testGovernmentEmailValidation($email, $passes): void
    {
        $data = ['test' => $email];

        $validator = Validator::make($data, ['test' => new GovernmentEmail]);
        $isValid = $validator->passes();

        if ($passes) {
            $this->assertTrue($isValid);
        } else {
            $this->assertFalse($isValid);
        }

    }

    public static function validationProvider(): array
    {

        $domains = [
            'gc.ca',
            'canada.ca',
            'elections.ca',
            'ccc.ca',
            'canadapost-postescanada.ca',
            'gg.ca',
            'scics.ca',
            'scc-csc.ca',
            'ccohs.ca',
            'cchst.ca',
            'edc.ca',
            'invcanada.ca',
            'parl.ca',
            'telefilm.ca',
            'bankofcanada.ca',
            'banqueducanada.ca',
            'ncc-ccn.ca',
            'bank-banque-canada.ca',
            'cef-cce.ca',
            'cgc.ca',
            'nfb.ca',
            'onf.ca',
            'canadacouncil.ca',
            'conseildesarts.ca',
            'humanrights.ca',
            'droitsdelapersonne.ca',
            'ingeniumcanada.org',
            'cjc-ccm.ca',
            'bdc.ca',
            'idrc.ca',
            'museedelhistoire.ca',
            'historymuseum.ca',
            'cdic.ca',
            'sadc.ca',
            'scc.ca',
            'clc.ca',
            'clc-sic.ca',
            'cntower.ca',
            'latourcn.ca',
        ];

        $passes = [];
        foreach ($domains as $domain) {
            $passes[$domain.' passes validation'] = ['passes@'.$domain, true];
        }

        return [
            'non government email fails validation' => ['email@domain.com', false],
            ...$passes,
        ];
    }
}
