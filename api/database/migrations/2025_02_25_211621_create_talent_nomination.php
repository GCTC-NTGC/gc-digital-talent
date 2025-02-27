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
        Schema::create('talent_nominations', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();

            $table->jsonb('submitted_steps')->default(json_encode([]));
            $table->foreignUuid('talent_nomination_event_id')->nullable()->constrained('talent_nomination_events');
            $table->timestamp('submitted_at')->nullable();
            $table->foreignUuid('submitter_id')->constrained('users');
            $table->string('submitter_relationship_to_nominator')->nullable();
            $table->string('submitter_relationship_to_nominator_other')->nullable();
            $table->foreignUuid('nominator_id')->nullable()->constrained('users');
            $table->string('nominator_fallback_work_email')->nullable();
            $table->string('nominator_fallback_name')->nullable();
            $table->foreignUuid('nominator_fallback_classification_id')->nullable()->constrained('classifications');
            $table->foreignUuid('nominator_fallback_department_id')->nullable()->constrained('departments');
            $table->string('nominator_review')->nullable();
            $table->foreignUuid('nominee_id')->nullable()->constrained('users');
            $table->string('nominee_review')->nullable();
            $table->string('nominee_relationship_to_nominator')->nullable();
            $table->string('nominee_relationship_to_nominator_other')->nullable();
            $table->boolean('nominate_for_advancement')->nullable();
            $table->boolean('nominate_for_lateral_movement')->nullable();
            $table->boolean('nominate_for_development_programs')->nullable();
            $table->foreignUuid('advancement_reference_id')->nullable()->constrained('users');
            $table->string('advancement_reference_review')->nullable();
            $table->string('advancement_reference_fallback_work_email')->nullable();
            $table->string('advancement_reference_fallback_name')->nullable();
            $table->foreignUuid('advancement_reference_fallback_classification_id')->nullable()->constrained('classifications');
            $table->foreignUuid('advancement_reference_fallback_department_id')->nullable()->constrained('departments');
            $table->jsonb('lateral_movement_options')->nullable();
            $table->string('lateral_movement_options_other')->nullable();
            $table->string('development_program_options_other')->nullable();
            $table->text('nomination_rationale')->nullable();
            $table->text('nomination_comments')->nullable();
        });

        Schema::create('development_program_talent_nomination', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('development_program_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('talent_nomination_id')
                ->constrained()
                ->onDelete('cascade');
        });

        Schema::create('skill_talent_nomination', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('skill_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('talent_nomination_id')
                ->constrained()
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('skill_talent_nomination');
        Schema::drop('development_program_talent_nomination');
        Schema::drop('talent_nominations');
    }
};
