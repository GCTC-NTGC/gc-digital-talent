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
            $table->boolean('is_published')->default(false);
            $table->jsonb('your_impact')->nullable()->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('advertisement_location')->nullable()->default(json_encode(['en' => '', 'fr' => '']));
            $table->string('security_clearance')->nullable();
            $table->string('advertisement_language')->nullable();
        });

        Schema::create('pools_essential_skills', function (Blueprint $table) {
            $table->uuid('skill_id')->nullable();
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->uuid('pool_id')->nullable();
            $table->foreign('pool_id')->references('id')->on('pools');
            $table->string('pool_type')->nullable();
            $table->unique(['skill_id', 'pool_id']);
            $table->timestamps();
        });

        Schema::create('pools_nonessential_skills', function (Blueprint $table) {
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
                'advertisement_location',
                'security_clearance',
                'advertisement_language',
            ]);
        });
        Schema::dropIfExists('pools_essential_skills');
        Schema::dropIfExists('pools_nonessential_skills');
    }
}
