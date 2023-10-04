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
        Schema::create('assessment_steps', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('pool_id');
            $table->foreign('pool_id')->references('id')->on('pools')->cascadeOnDelete(true);
            $table->integer('sort_order')->nullable();
            $table->string('type')->nullable();
            $table->jsonb('title')->default(json_encode(['en' => '', 'fr' => '']))->nullable();
            $table->timestamps();
        });

        Schema::create('assessment_step_pool_skill', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('assessment_step_id');
            $table->foreign('assessment_step_id')->references('id')->on('assessment_steps')->cascadeOnDelete(true);
            $table->uuid('pool_skill_id');
            $table->foreign('pool_skill_id')->references('id')->on('pool_skill')->cascadeOnDelete(true);
            $table->timestamps();
        });

        Schema::table('pool_skill', function (Blueprint $table) {
            $table->dropForeign('pool_skill_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools')->cascadeOnDelete(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_step_pool_skill');
        Schema::dropIfExists('assessment_steps');
        Schema::table('pool_skill', function (Blueprint $table) {
            $table->dropForeign('pool_skill_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
    }
};
