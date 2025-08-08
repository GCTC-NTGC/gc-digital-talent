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
        Schema::create('off_platform_recruitment_processes', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
            $table->timestamps();
            $table->string('process_number')->nullable();
            $table->uuid('department_id')->nullable();
            $table->foreign('department_id')->references('id')->on('departments');
            $table->uuid('classification_id')->nullable();
            $table->foreign('classification_id')->references('id')->on('classifications');
            $table->string('platform')->nullable();
            $table->string('platform_other')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('off_platform_recruitment_processes');
    }
};
