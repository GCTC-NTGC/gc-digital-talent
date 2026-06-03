<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('talent_request_tracked_users', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));

            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('talent_request_id')
                ->constrained()
                ->onDelete('cascade');

            $table->unique(['talent_request_id', 'user_id']);

            $table->string('referral_decision')->nullable();
            $table->string('selection_decision')->nullable();
            $table->string('not_referred_reason')->nullable();
            $table->string('not_selected_reason')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('talent_request_tracked_users');
    }
};
