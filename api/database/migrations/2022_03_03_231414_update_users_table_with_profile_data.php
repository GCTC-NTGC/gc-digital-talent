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
        });

        Schema::create('classification_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->uuid('classification_id');
            $table->foreign('classification_id')->references('id')->on('classifications');
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users');
        });
        DB::statement('ALTER TABLE classification_user ALTER COLUMN id SET DEFAULT gen_random_uuid();');
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
                'current_classification'
            ]);
        });

        Schema::dropIfExists('classification_user');
    }
}
