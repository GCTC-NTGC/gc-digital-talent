<?php

use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;

class PoolTest extends TestCase
{
  use \Illuminate\Foundation\Testing\RefreshDatabase;
  use MakesGraphQLRequests;
  use ClearsSchemaCache;

  protected function setUp(): void
  {
    parent::setUp();
    $this->bootClearsSchemaCache();
  }

  public function testPoolAdvertisementAccessor(): void
  {
    // Create new pools and attach to new pool candidates.
    $pool1 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'is_published' => true,
        'expiry_date' => '2050-01-01',
    ]);
    $pool2 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        'is_published' => true,
        'expiry_date' => '2020-01-01',
    ]);
    $pool3 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        'is_published' => false,
        'expiry_date' => '2050-01-01',
    ]);
    $pool4 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        'is_published' => false,
        'expiry_date' => '2020-01-01',
    ]);

    // Assert query with pool 1 will return accessor as published
    $this->graphQL(/** @lang Graphql */ '
        query poolAdvertisement {
            poolAdvertisement(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11") {
                advertisementStatusAccessor {
                    advertisementStatus
                }
            }
        }
    ')->assertJson([
         "data" => [
            "poolAdvertisement" => [
                "advertisementStatusAccessor" => [
                    "advertisementStatus" => ApiEnums::POOL_ADVERTISEMENT_IS_PUBLISHED,
                ]
            ]
        ]
    ]);

    // Assert query with pool 2 will return accessor as expired
    $this->graphQL(/** @lang Graphql */ '
        query poolAdvertisement {
            poolAdvertisement(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12") {
                advertisementStatusAccessor {
                    advertisementStatus
                }
            }
        }
    ')->assertJson([
         "data" => [
            "poolAdvertisement" => [
                "advertisementStatusAccessor" => [
                    "advertisementStatus" => ApiEnums::POOL_ADVERTISEMENT_IS_EXPIRED,
                ]
            ]
        ]
    ]);

    // Assert query with pool 3 will return accessor as draft
    $this->graphQL(/** @lang Graphql */ '
        query poolAdvertisement {
            poolAdvertisement(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13") {
                advertisementStatusAccessor {
                    advertisementStatus
                }
            }
        }
    ')->assertJson([
         "data" => [
            "poolAdvertisement" => [
                "advertisementStatusAccessor" => [
                    "advertisementStatus" => ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT,
                ]
            ]
        ]
    ]);

    // Assert query with pool 4 will return accessor as draft
    $this->graphQL(/** @lang Graphql */ '
        query poolAdvertisement {
            poolAdvertisement(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14") {
                advertisementStatusAccessor {
                    advertisementStatus
                }
            }
        }
    ')->assertJson([
         "data" => [
            "poolAdvertisement" => [
                "advertisementStatusAccessor" => [
                    "advertisementStatus" => ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT,
                ]
            ]
        ]
    ]);
  }
}
