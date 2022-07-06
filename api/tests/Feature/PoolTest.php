<?php

use App\Models\Pool;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;

class PoolTest extends TestCase
{
  use RefreshDatabase;
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
        'expiry_date' => config('constants.far_future_date'),
    ]);
    $pool2 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        'is_published' => true,
        'expiry_date' => config('constants.past_date'),
    ]);
    $pool3 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        'is_published' => false,
        'expiry_date' => config('constants.far_future_date'),
    ]);
    $pool4 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        'is_published' => false,
        'expiry_date' => config('constants.past_date'),
    ]);

    // Assert query with pool 1 will return accessor as published
    $this->graphQL(/** @lang Graphql */ '
        query poolAdvertisement {
            poolAdvertisement(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11") {
                advertisementStatus
            }
        }
    ')->assertJson([
         "data" => [
            "poolAdvertisement" => [
               "advertisementStatus" => ApiEnums::POOL_ADVERTISEMENT_IS_PUBLISHED,
            ]
        ]
    ]);

    // Assert query with pool 2 will return accessor as expired
    $this->graphQL(/** @lang Graphql */ '
        query poolAdvertisement {
            poolAdvertisement(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12") {
                advertisementStatus
            }
        }
    ')->assertJson([
         "data" => [
            "poolAdvertisement" => [
                "advertisementStatus" => ApiEnums::POOL_ADVERTISEMENT_IS_EXPIRED,
            ]
        ]
    ]);

    // Assert query with pool 3 will return accessor as draft
    $this->graphQL(/** @lang Graphql */ '
        query poolAdvertisement {
            poolAdvertisement(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13") {
                advertisementStatus
            }
        }
    ')->assertJson([
         "data" => [
            "poolAdvertisement" => [
                "advertisementStatus" => ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT,
            ]
        ]
    ]);

    // Assert query with pool 4 will return accessor as draft
    $this->graphQL(/** @lang Graphql */ '
        query poolAdvertisement {
            poolAdvertisement(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14") {
                advertisementStatus
            }
        }
    ')->assertJson([
         "data" => [
            "poolAdvertisement" => [
                "advertisementStatus" => ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT,
            ]
        ]
    ]);
  }

}
