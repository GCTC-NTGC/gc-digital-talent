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
    }
}
