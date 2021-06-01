<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePoolCandidatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pool_candidates', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('cmo_identifier')->nullable(true);
            $table->date('expiry_date')->nullable(true);

            $table->boolean('is_woman')->nullable(true);
            $table->boolean('has_disability')->nullable(true);
            $table->boolean('is_indigenous')->nullable(true);
            $table->boolean('is_visible_minority')->nullable(true);

            $table->boolean('has_diploma')->nullable(true);
            $table->string('language_ability')->nullable(true);
            $table->text('location_preferences')->nullable(true);
            $table->text('expected_salary')->nullable(true);
            $table->string('pool_candidate_status')->nullable(true);

            $table->foreignId('pool_id')->nullable(false);
            $table->foreignId('user_id')->nullable(false);
        });
        Schema::create('operational_requirement_pool_candidate', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('pool_candidate_id')->nullable(false);;
            $table->foreignId('operational_requirement_id')->nullable(false);;
        });
        Schema::create('classification_pool_candidate', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('pool_candidate_id')->nullable(false);;
            $table->foreignId('classification_id')->nullable(false);;
        });
        Schema::create('cmo_asset_candidate', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('pool_candidate_id')->nullable(false);;
            $table->foreignId('cmo_asset_id')->nullable(false);;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pool_candidates');
        Schema::dropIfExists('operational_requirement_pool_candidate');
        Schema::dropIfExists('classification_pool_candidate');
        Schema::dropIfExists('cmo_asset_candidate');
    }
}
