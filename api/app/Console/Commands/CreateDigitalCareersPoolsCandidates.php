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
        $assetArray = [];
        // index is asset model id field, value is asset key field
        foreach ($assetsCollection as $asset) {
            $assetArray[$asset->id] = $asset->key;
        }
        $assetKeyToStreamMap = [
            "db_admin" => ApiEnums::POOL_STREAM_DATABASE_MANAGEMENT,
            "infrastructure_ops" => ApiEnums::POOL_STREAM_INFRASTRUCTURE_OPERATIONS,
            "cybersecurity" => ApiEnums::POOL_STREAM_SECURITY,
            "app_dev" => ApiEnums::POOL_STREAM_SOFTWARE_SOLUTIONS,
            "enterprise_architecture" => ApiEnums::POOL_STREAM_ENTERPRISE_ARCHITECTURE,
            // IT Business Analyst / IT Project Management -> Project Portfolio Management
            //  ? -> Business Line Advisory Services
            // ? -> Planning and Reporting
            // Application Testing / Quality Assurance -> ?
            // Data Science / Analysis -> ?
            // Information Management (IM) -> ?
        ];

        /**
         * check whether a candidate possesses an expected classification
         * @return boolean
        */
        function candidateMatchesClassification(string $candidateId, string $classificationId): bool {
            $candidateClassificationsArray = PoolCandidate::where('id', $candidateId)
                                                ->first()
                                                ->expectedClassifications()
                                                ->pluck('classifications.id')
                                                ->toArray();
            if (in_array($classificationId, $candidateClassificationsArray)) {
                return true;
            }
            return false;
        }

        /**
         * check whether a candidate can match a pool stream
         * @return boolean
        */
        function candidateMatchesStream(string $candidateId, string $stream): bool {
            global $assetArray, $assetKeyToStreamMap;
            $candidateAssetsArray = PoolCandidate::where('id', $candidateId)
                                    ->get()
                                    ->cmoAssets()
                                    ->pluck('cmo_assets.id')
                                    ->toArray();
            foreach ($candidateAssetsArray as $assetId) {
                $assetKey = $assetArray[$assetId];
                $correspondingStream = $assetKeyToStreamMap[$assetKey];
                if ($correspondingStream == $stream) {
                    return true;
                }
            }
            return false;
        }

        foreach ($candidateCollection as $candidate) {
            //
            $candidateId = $candidate->id;
            $userId = $candidate->user_id;

            foreach ($ITLevels as $index => $level) {
                //
                $classificationId = Classification::where('group', 'ilike', 'IT')
                                        ->where('level', $level)
                                        ->first()
                                        ->toArray()['id'];

                foreach ($poolStreams as $index => $stream) {
                    //
                    $associatedPoolId = Pool::where('stream', 'ilike', $stream)
                                            ->whereHas('classifications', function($query) use ($classificationId) {
                                                $query->whereIn('classification_id', [$classificationId]);
                                            })
                                            ->first()
                                            ->toArray()['id'];

                    if (candidateMatchesClassification($candidateId, $classificationId) && candidateMatchesStream($candidateId, $stream)) {
                        //
                        PoolCandidate::create([
                            'user_id' => $userId,
                            'pool_id' => $associatedPoolId,
                            'submitted_at' => $dateNow,
                            'expiry_date' => $expiryDate,
                            // pool_candidate_status => ?,
                        ]);
                    }
                }
            }
        }
    }
}
