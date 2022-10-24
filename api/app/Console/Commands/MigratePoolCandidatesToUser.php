<?php

namespace App\Console\Commands;

use Illuminate\Support\Facades\DB;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Console\Command;

class MigratePoolCandidatesToUser extends Command
{
    // this command copies data from the pool candidates table that has been deemed best to fit on the User model
    // this includes personal info, as well as Assets/Classifications

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:pool_candidate_to_user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate data over from Pool Candidates to User tables';

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
        // update table users with data from table pool_candidates
        DB::statement('UPDATE users
                    SET is_woman = p.is_woman,
                        has_disability = p.has_disability,
                        is_indigenous = p.is_indigenous,
                        is_visible_minority = p.is_visible_minority,
                        has_diploma = p.has_diploma,
                        language_ability = p.language_ability,
                        location_preferences = p.location_preferences,
                        accepted_operational_requirements = p.accepted_operational_requirements,
                        expected_salary = p.expected_salary
                    FROM pool_candidates p
                    WHERE users.id = p.user_id');

        // insert data into cmo_users and classifications_user using PoolCandidate and User models with query builder
        $allPoolCandidates = PoolCandidate::all();
        foreach($allPoolCandidates as $candidate){
            $userId = $candidate->user_id;

            // build arrays of Assets and Classifications existing on PoolCandidate model and attached User
            $classificationsCandidate = $candidate->expectedClassifications()->pluck('classifications.id')->toArray();
            $assetsCandidate = $candidate->cmoAssets()->pluck('cmo_assets.id')->toArray();
            $classificationsUser = User::where('id', $userId)->first()->expectedClassifications()->pluck('classifications.id')->toArray();
            $assetsUser = User::where('id', $userId)->first()->cmoAssets()->pluck('cmo_assets.id')->toArray();

            // merge into a combined Assets array as well as Classifications array, then remove duplicates
            $combinedClassifications = array_merge($classificationsCandidate, $classificationsUser);
            $combinedClassificationsDedupe = array_unique($combinedClassifications);
            $combinedAssets = array_merge($assetsCandidate, $assetsUser);
            $combinedAssetsDedupe = array_unique($combinedAssets);

            // sync the User with the de-duped arrays
            User::where('id', $userId)->first()->expectedClassifications()->sync($combinedClassificationsDedupe);
            User::where('id', $userId)->first()->cmoAssets()->sync($combinedAssetsDedupe);
        }
    }
}
