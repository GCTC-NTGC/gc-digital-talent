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
        Schema::create('job_poster_templates', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();
            $table->string('reference_id');
            $table->string('supervisory_status');
            $table->string('stream');
            $table->jsonb('name')->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('description')->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('work_description')->nullable()->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('tasks')->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('keywords')->default(json_encode(['en' => [], 'fr' => []]));
            $table->jsonb('essential_technical_skills_notes')->nullable()->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('essential_behavioural_skills_notes')->nullable()->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('nonessential_technical_skills_notes')->nullable()->default(json_encode(['en' => '', 'fr' => '']));
            $table->foreignUuid('classification_id')
                ->constrained();
        });

        Schema::create('job_poster_template_skill', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('job_poster_template_id')->constrained();
            $table->foreignUuid('skill_id')->constrained();
            $table->string('type');
            $table->string('required_skill_level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_poster_template_skill');
        Schema::dropIfExists('job_poster_templates');
    }
};
