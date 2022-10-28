<?php

namespace App\Console\Commands;

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Classification;
use App\Models\CmoAsset;
use Database\Helpers\ApiEnums;
use Illuminate\Console\Command;
use Carbon\Carbon;

class CreateDigitalCareersPoolsCandidates extends Command
{
    // this command updates runs through all the candidates of the old digital careers pool and creates new candidate models
    // it works by mapping by some criteria
    // please create the new pools first

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:new_digital_pool_candidates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Map candidates of the old pool to the new pools.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // collect starting data
        $oldDigitalCareersId = Pool::where('key', 'ilike', 'digital_careers')->first()->toArray()['id'];
        $candidateCollection = PoolCandidate::where('pool_id', $oldDigitalCareersId)->get();
        $ITLevels = [1, 2, 3, 4];
        $poolStreams = ApiEnums::poolStreams();
        $dateNow = Carbon::now();
        $expiryDate = Carbon::now()->addYear();

        // organizing assets and streams mapping
        $assetsCollection = CmoAsset::all();
        // array where the index is the asset model id field, value is asset key field
        global $assetArrayMap;
        $assetArrayMap = $assetsCollection->mapWithKeys(function ($asset) {
            return [$asset['id'] => $asset['key']];
        });
        global $assetKeyToStreamMap;
        $assetKeyToStreamMap = [
            "db_admin" => ApiEnums::POOL_STREAM_DATABASE_MANAGEMENT,
            "infrastructure_ops" => ApiEnums::POOL_STREAM_INFRASTRUCTURE_OPERATIONS,
            "cybersecurity" => ApiEnums::POOL_STREAM_SECURITY,
            "app_dev" => ApiEnums::POOL_STREAM_SOFTWARE_SOLUTIONS,
            "enterprise_architecture" => ApiEnums::POOL_STREAM_ENTERPRISE_ARCHITECTURE,
            "app_testing" => ApiEnums::POOL_STREAM_SOFTWARE_SOLUTIONS,
            "data_science" => ApiEnums::POOL_STREAM_INFORMATION_DATA_FUNCTIONS,
            "information_management" => ApiEnums::POOL_STREAM_INFORMATION_DATA_FUNCTIONS,
            "project_management" => ApiEnums::POOL_STREAM_PROJECT_PORTFOLIO_MANAGEMENT,
        ];

        /**
         * check whether a candidate possesses an expected classification or fits by desired salary
         * @return boolean
        */
        function candidateMatchesClassification(string $candidateId,
                                                string $classificationId,
                                                ?array $expectedSalary, // can be null
                                                string $classificationMinSalary,
                                                string $classificationMaxSalary): bool {

            $candidateClassificationsArray = PoolCandidate::where('id', $candidateId)
                                                ->first()
                                                ->expectedClassifications()
                                                ->pluck('classifications.id')
                                                ->toArray();
            if (in_array($classificationId, $candidateClassificationsArray)) {
                return true;
            }
            if ($expectedSalary) {
                $minSalaryInt = intval($classificationMinSalary);
                $maxSalaryInt = intval($classificationMaxSalary);
                $salaryArray = [];
                // $expectedSalary is an array of strings, need to convert to array of array pairs, each pair creating lower/upper limits of ints
                foreach ($expectedSalary as $salary) {
                    switch($salary) {
                        case '_50_59K':
                            array_push($salaryArray, [50000, 59999]);
                            break;
                        case '_60_69K':
                            array_push($salaryArray, [60000, 69999]);
                            break;
                        case '_70_79K':
                            array_push($salaryArray, [70000, 79999]);
                            break;
                        case '_80_89K':
                            array_push($salaryArray, [80000, 89999]);
                            break;
                        case '_90_99K':
                            array_push($salaryArray, [90000, 99999]);
                            break;
                        case'_100K_PLUS':
                            array_push($salaryArray, [100000, 999999]);
                            break;
                    }
                }

                // having created the array of arrays with paired ints, step through each one and see if a classification's salary range lines up
                // a match is when a salary int is MORE than the lower limit AND LESS than the upper limit
                foreach ($salaryArray as $salaryPair) {
                    if ($salaryPair[0] <= $minSalaryInt && $salaryPair[1] >= $minSalaryInt) {
                        return true;
                    }
                    if ($salaryPair[0] <= $maxSalaryInt && $salaryPair[1] >= $maxSalaryInt) {
                        return true;
                    }
                }
                return false;
            }
            return false;
        }

        /**
         * check whether a candidate can match a pool stream
         * @return boolean
        */
        function candidateMatchesStream(string $candidateId, string $stream): bool {
            global $assetArrayMap, $assetKeyToStreamMap;

            // must build array of cmo asset id's associated with a candidate
            $candidateWithAssetsCollection = PoolCandidate::where('id', $candidateId)
                                    ->get()
                                    ->load(['cmoAssets'])
                                    ->toArray();
            $candidateWithAssets = $candidateWithAssetsCollection[0]; // get() returns desired collection shape but as an array of one item
            $assetsArray = $candidateWithAssets['cmo_assets']; // grab array of assets models
            $assetsIdArray = [];
            foreach ($assetsArray as $asset) {
                array_push($assetsIdArray, $asset['pivot']['cmo_asset_id']);
            }

            // having collected an array of asset ids, can now iterate through and check for matches using the global variables
            foreach ($assetsIdArray as $assetId) {
                $assetKey = $assetArrayMap[$assetId];
                // to avoid errors where the map is missing a key
                if (array_key_exists($assetKey, $assetKeyToStreamMap)){
                    $correspondingStream = $assetKeyToStreamMap[$assetKey];
                    if ($correspondingStream == $stream) {
                        return true;
                    }
                }
            }
            return false;
        }

        // main part, loop through all the candidates, and loop through all classification/streams, calling above functions
        // create a new pool candidate instance when both functions return TRUE
        foreach ($candidateCollection as $candidate) {
            $candidateId = $candidate->id;
            $userId = $candidate->user_id;
            $expectedSalary = $candidate->expected_salary;
            $currentStatus = $candidate->pool_candidate_status;

            foreach ($ITLevels as $index => $level) {
                $classification = Classification::where('group', 'ilike', 'IT')
                                        ->where('level', $level)
                                        ->first()
                                        ->toArray();
                $classificationId = $classification['id'];
                $classificationMinSalary = $classification['min_salary'];
                $classificationMaxSalary = $classification['max_salary'];

                foreach ($poolStreams as $index => $stream) {
                    // grab the new pool that has the appropriate classification + stream
                    $associatedPoolId = Pool::where('stream', 'ilike', $stream)
                                            ->where('key', null) // new pools have no key value, so this blocks matching with the old pool
                                            ->whereHas('classifications', function($query) use ($classificationId) {
                                                $query->whereIn('classification_id', [$classificationId]);
                                            })
                                            ->first()
                                            ->toArray()['id'];

                    // execute functions, pass in values from above, two booleans are return and if both are TRUE then create a candidate
                    if (candidateMatchesClassification($candidateId, $classificationId, $expectedSalary, $classificationMinSalary, $classificationMaxSalary)
                            && candidateMatchesStream($candidateId, $stream)) {
                        PoolCandidate::create([
                            'user_id' => $userId,
                            'pool_id' => $associatedPoolId,
                            'submitted_at' => $dateNow,
                            'expiry_date' => $expiryDate,
                            'pool_candidate_status' => $currentStatus,
                        ]);
                    }
                }
            }
        }
    }
}
