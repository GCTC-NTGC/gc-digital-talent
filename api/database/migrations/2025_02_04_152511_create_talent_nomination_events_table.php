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
        Schema::create('talent_nomination_events', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();
            $table->jsonb('name')->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('description')->default(json_encode(['en' => '', 'fr' => '']))->nullable();
            $table->datetime('open_date');
            $table->datetime('close_date');
            $table->jsonb('learn_more_url')->default(json_encode(['en' => '', 'fr' => '']))->nullable();
            $table->boolean('include_leadership_competencies')->nullable();

            $table->foreignUuid('community_id')
                ->constrained()
                ->onDelete('cascade');
        });

        Schema::create('development_program_talent_nomination_event', function (Blueprint $table) {
            $table->foreignUuid('development_program_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignUuid('talent_nomination_event_id')
                ->constrained()
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('development_program_talent_nomination_event');
        Schema::dropIfExists('talent_nomination_events');
    }
};
