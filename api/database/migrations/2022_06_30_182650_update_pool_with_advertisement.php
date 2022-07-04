<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePoolWithAdvertisement extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->timestamptz('expiry_date')->nullable();
        });

        Schema::table('pools', function (Blueprint $table) {
            $table->boolean('is_published')->default(false);
        });

        Schema::table('pools', function (Blueprint $table) {
            $table->jsonb('your_impact')->nullable()->default(json_encode(['en' => '', 'fr' => '']));
        });

        Schema::table('pools', function (Blueprint $table) {
            $table->string('poster_location')->nullable();
        });

        Schema::table('pools', function (Blueprint $table) {
            $table->string('security_clearance')->nullable();
        });

        Schema::table('pools', function (Blueprint $table) {
            $table->string('poster_ad_language')->nullable();
        });

        Schema::create('pools_essential_skills', function (Blueprint $table) {
            $table->text('details')->nullable();
            $table->uuid('skill_id')->nullable();
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->uuid('pool_id')->nullable();
            $table->foreign('pool_id')->references('id')->on('pools');
            $table->string('pool_type')->nullable();
            $table->unique(['skill_id', 'pool_id']);
            $table->timestamps();
        });

        Schema::create('pools_nonessential_skills', function (Blueprint $table) {
            $table->text('details')->nullable();
            $table->uuid('skill_id')->nullable();
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->uuid('pool_id')->nullable();
            $table->foreign('pool_id')->references('id')->on('pools');
            $table->string('pool_type')->nullable();
            $table->unique(['skill_id', 'pool_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn([
                'expiry_date',
                'is_published',
                'your_impact',
                'poster_location',
                'security_clearance',
                'poster_ad_language',
            ]);
        });
        Schema::dropIfExists('pools_essential_skills');
        Schema::dropIfExists('pools_nonessential_skills');
    }
}
