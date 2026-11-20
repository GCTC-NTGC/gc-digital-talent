<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // pools a user has already been alerted about, so each pool is sent at most once per user
        Schema::create('job_alert_notified_pools', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('gen_random_uuid()'));
            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('pool_id')
                ->constrained()
                ->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'pool_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_alert_notified_pools');
    }
};
