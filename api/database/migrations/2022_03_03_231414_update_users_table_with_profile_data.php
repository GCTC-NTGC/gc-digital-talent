<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTableWithProfileData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // New fields
            $table->string('job_looking_status')->nullable();
            $table->string('current_province')->nullable();
            $table->string('current_city')->nullable();
            $table->boolean('looking_for_english')->nullable();
            $table->boolean('looking_for_french')->nullable();
            $table->boolean('looking_for_bilingual')->nullable();
            $table->string('bilingual_evaluation')->nullable();
            $table->string('comprehension_level')->nullable();
            $table->string('written_level')->nullable();
            $table->string('verbal_level')->nullable();
            $table->string('estimated_language_ability')->nullable();
            $table->boolean('is_gov_employee')->nullable();
            $table->boolean('interested_in_later_or_secondment')->nullable();
            $table->uuid('current_classification')->nullable();
            $table->foreign('current_classification')->references('id')->on('classifications');
            $table->string('location_exemptions')->nullable();
            $table->boolean('would_accept_temporary')->nullable();

            // Old fields from poolCandidate
            $table->boolean('is_woman')->nullable();
            $table->boolean('has_disability')->nullable();
            $table->boolean('is_indigenous')->nullable();
            $table->boolean('is_visible_minority')->nullable();

            $table->boolean('has_diploma')->nullable();
            $table->string('language_ability')->nullable();
            $table->jsonb('location_preferences')->nullable();
            $table->jsonb('expected_salary')->nullable();
        });

        // New tables to replace connections with pool candidates
        Schema::create('operational_requirement_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('user_id')->references('id')->on('users')->nullable(false);
            $table->uuid('operational_requirement_id')->references('id')->on('operational_requirements')->nullable(false);
        });
        DB::statement('ALTER TABLE operational_requirement_user ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('classification_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('user_id')->references('id')->on('users')->nullable(false);
            $table->uuid('classification_id')->references('id')->on('classifications')->nullable(false);
        });
        DB::statement('ALTER TABLE classification_user ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('cmo_asset_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('user_id')->references('id')->on('users')->nullable(false);
            $table->uuid('cmo_asset_id')->references('id')->on('cmo_assets')->nullable(false);
        });
        DB::statement('ALTER TABLE cmo_asset_user ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'job_looking_status',
                'current_province',
                'current_city',
                'looking_for_english',
                'looking_for_french',
                'looking_for_bilingual',
                'bilingual_evaluation',
                'comprehension_level',
                'written_level',
                'verbal_level',
                'estimated_language_ability',
                'is_gov_employee',
                'interested_in_later_or_secondment',
                'current_classification',
                'location_exemptions',
                'would_accept_temporary',
                'is_woman',
                'has_disability',
                'is_indigenous',
                'is_visible_minority',
                'has_diploma',
                'language_ability',
                'location_preferences',
                'expected_salary',
            ]);
        });
        Schema::dropIfExists('operational_requirement_user');
        Schema::dropIfExists('classification_user');
        Schema::dropIfExists('cmo_asset_user');
    }
}
