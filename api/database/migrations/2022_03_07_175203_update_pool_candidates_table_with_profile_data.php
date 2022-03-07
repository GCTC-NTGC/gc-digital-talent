<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePoolCandidatesTableWithProfileData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->jsonb('location_exemptions')->nullable();
            $table->boolean('accepts_temporary')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn([
                'location_exemptions',
                'accepts_temporary'
            ]);
        });
    }
}
