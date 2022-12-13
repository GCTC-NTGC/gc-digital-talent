<?php

use App\Models\Pool;
use App\Models\User;
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

    $newUser = new User;
    $newUser->email = 'admin@test.com';
    $newUser->sub = 'admin@test.com';
    $newUser->roles = ['ADMIN'];
    $newUser->save();
  }

  public function testPoolAdvertisementAccessor(): void
  {
    // Create new pools and attach to new pool candidates.
    $pool1 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'published_at' => config('constants.past_date'),
        'expiry_date' => config('constants.far_future_date'),
    ]);
    $pool2 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        'published_at' => config('constants.past_date'),
        'expiry_date' => config('constants.past_date'),
    ]);
    $pool3 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        'published_at' => null,
        'expiry_date' => config('constants.far_future_date'),
    ]);
    $pool4 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        'published_at' => null,
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

  public function testPoolAdvertisementAccessorTime(): void
  {
    // test that expiry on day of functions as expected, that soon to expire can be applied to and just expired is longer open for application
    $expireInHour = date("Y-m-d H:i:s", strtotime('+1 hour'));
    $expiredLastHour = date("Y-m-d H:i:s", strtotime('-1 hour'));

    $pool1 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'published_at' => config('constants.past_date'),
        'expiry_date' => $expireInHour,
    ]);
    $pool2 = Pool::factory()->create([
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        'published_at' => config('constants.past_date'),
        'expiry_date' => $expiredLastHour,
    ]);

    // Assert query with pool 1 will still be published
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

    // Assert query with pool 2 will return as expired
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
  }

  // The publishedPoolAdvertisements query should only return pools that have been published
  public function testPoolAdvertisementQueryReturnsOnlyPublished(): void
  {
    // this pool has been published so it should be returned in the publishedPool query
    $publishedPool = Pool::factory()->create([
        'published_at' => config('constants.past_date'),
    ]);
    // this pool is still a draft so it should not be returned in the publishedPool query
    $draftPool = Pool::factory()->create([
        'published_at' => null,
    ]);

    // Assert query will return only the published pool
    $this->graphQL(/** @lang Graphql */ '
        query browsePools {
            publishedPoolAdvertisements {
              id
            }
          }
    ')->assertJson([
         "data" => [
            "publishedPoolAdvertisements" => [
               [
                   "id" => $publishedPool->id,
               ],
            ]
        ]
    ]);
  }
}
