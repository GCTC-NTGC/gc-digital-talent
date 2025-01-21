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
        Schema::create('training_opportunities', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();
            $table->jsonb('title')->default(json_encode(['en' => '', 'fr' => '']));
            $table->string('course_language')->nullable();
            $table->date('registration_deadline')->nullable();
            $table->date('training_start')->nullable();
            $table->date('training_end')->nullable();
            $table->jsonb('description')->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('application_url')->default(json_encode(['en' => '', 'fr' => '']));
            $table->string('course_format')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_opportunities');
    }
};
