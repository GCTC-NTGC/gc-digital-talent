<?php

namespace App\Console\Commands;

use App\Models\Pool;
use Database\Helpers\ApiEnums;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ExpireOldDigitalCareersPoolCandidates extends Command
{
    // this command updates all candidates associated with pool of key = digital_careers as expired
    // this does so by expiry date and pool candidate status, a double approach as status determination is changing

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'expire:old_digital_pool_candidates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire the candidates of the old digital careers pool.';

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
        // fill variables then execute the database statement with them
        $expiredStatus = ApiEnums::CANDIDATE_STATUS_EXPIRED;
        $oldDigitalCareersId = Pool::where('key', 'ilike', 'digital_careers')->first()->toArray()['id'];

        DB::update("update pool_candidates
                    set expiry_date = TIMESTAMP 'now',
                        updated_at = TIMESTAMP 'now',
                        pool_candidate_status = :expiry
                    where pool_id = :id",
                    ['expiry' => $expiredStatus, 'id' => $oldDigitalCareersId]);
    }
}
