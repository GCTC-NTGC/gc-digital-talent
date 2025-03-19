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
        Schema::create('talent_nomination_groups', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();

            $table->foreignUuid('nominee_id')->constrained('users');
            $table->foreignUuid('talent_nomination_event_id')->constrained('talent_nomination_events');
            $table->string('advancement_decision')->nullable();
            $table->boolean('advancement_reference_confirmed')->nullable();
            $table->text('advancement_notes')->nullable();
            $table->string('lateral_movement_decision')->nullable();
            $table->text('lateral_movement_notes')->nullable();
            $table->string('development_programs_decision')->nullable();
            $table->text('development_programs_notes')->nullable();
            $table->string('computed_status')->default('IN_PROGRESS'); // TalentNominationGroupStatus::IN_PROGRESS

            $table->unique(['nominee_id', 'talent_nomination_event_id']);
        });

        Schema::table('talent_nominations', function (Blueprint $table) {
            $table
                ->foreignUuid('talent_nomination_group_id')
                ->nullable()
                ->constrained('talent_nomination_groups');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('talent_nominations', function (Blueprint $table) {
            $table->dropColumn('talent_nomination_group_id');
        });

        Schema::dropIfExists('talent_nomination_groups');
    }
};
