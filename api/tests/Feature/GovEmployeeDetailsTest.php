<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Helpers\ApiErrorEnums;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class GovEmployeeDetailsTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    private User $baseUser;

    private string $query = <<<'GRAPHQL'
        query govEmployee($workEmail: String!) {
            govEmployee(workEmail: $workEmail) { id }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->baseUser = User::factory()
            ->asApplicant()
            ->create();
    }

    public function test_verified_government_employee_details_available()
    {
        $email = 'employee@gc.ca';
        $testUser = User::factory()
            ->asGovEmployee()
            ->create(['work_email' => $email]);

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($this->query, [
                'workEmail' => $email,
            ])->assertJson([
                'data' => [
                    'govEmployee' => [
                        'id' => $testUser->id,
                    ],
                ],
            ]);
    }

    public function test_unverified_government_employee_details_not_available()
    {
        $email = 'employee@gc.ca';
        User::factory()
            ->asGovEmployee()
            ->create(['work_email' => $email, 'work_email_verified_at' => null]);

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($this->query, [
                'workEmail' => $email,
            ])->assertJson([
                'data' => [
                    'govEmployee' => null,
                ],
            ]);
    }

    /**
     * @dataProvider validationProvider
     */
    public function test_government_email_validation($email, $passes): void
    {

        $testUser = User::factory()
            ->asGovEmployee()
            ->create(['work_email' => $email]);

        $res = $this->actingAs($this->baseUser, 'api')
            ->graphQL($this->query, [
                'workEmail' => $email,
            ]);

        if ($passes) {
            $res->assertJson([
                'data' => ['govEmployee' => ['id' => $testUser->id]],
            ]);
        } else {
            $res->assertGraphQLValidationError('workEmail', ApiErrorEnums::NOT_GOVERNMENT_EMAIL);
        }
    }

    public static function validationProvider(): array
    {

        $tlds = [
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
        foreach ($tlds as $tld) {
            $passes[$tld.' passes validation'] = ['passes@'.$tld, true];
        }

        return [
            'non government email fails validation' => ['email@domain.com', false],
            ...$passes,
        ];
    }
}
