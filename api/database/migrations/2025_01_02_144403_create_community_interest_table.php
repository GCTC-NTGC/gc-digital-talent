<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('community_interests', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('community_id')
                ->constrained()
                ->onDelete('cascade');
            $table->unique(['user_id', 'community_id']);
            $table->boolean('job_interest')->nullable();
            $table->boolean('training_interest')->nullable();
            $table->text('additional_information')->nullable();
            $table->timestamps();
        });

        Schema::create('community_interest_work_stream', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('community_interest_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('work_stream_id')
                ->constrained()
                ->onDelete('cascade');
            $table->unique(['community_interest_id', 'work_stream_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_interests');
        Schema::dropIfExists('communinty_interest_work_stream');
    }
};
