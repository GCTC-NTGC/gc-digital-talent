<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dateTime('suspended_at')->nullable();
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
                'suspended_at',
            ]);
        });
    }
};
