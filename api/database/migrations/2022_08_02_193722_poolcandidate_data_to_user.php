<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\PoolCandidate;
use App\Models\User;

class PoolCandidateDataToUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    public function up()
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
        $allUsers = User::all();
        foreach($allPoolCandidates as $candidate){
	        $classifications = $candidate->expectedClassifications()->pluck('classifications.id')->toArray();
            $assets = $candidate->cmoAssets()->pluck('cmo_assets.id')->toArray();
	        $userId = $candidate->user_id;
	        $allUsers->where('id', $userId)->first()->expectedClassifications()->sync($classifications);
            $allUsers->where('id', $userId)->first()->cmoAssets()->sync($assets);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // not a reversible migration
    }
}
