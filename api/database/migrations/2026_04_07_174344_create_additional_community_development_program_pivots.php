<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
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
        // create tables
        // community development program - talent event pivot
        // community development program - talent nomination pivot
        Schema::create('community_development_program_talent_nomination_event', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->foreignUuid('community_development_program_id')
                ->constrained('community_development_program', 'id')
                ->onDelete('cascade');
            $table->foreignUuid('talent_nomination_event_id')
                ->constrained('talent_nomination_events', 'id')
                ->onDelete('cascade');
            $table->jsonb('description_for_nominations')->default(json_encode(['en' => '', 'fr' => '']))->nullable();
            $table->unique(['community_development_program_id', 'talent_nomination_event_id'], 'community_development_program_talent_nomination_event_unique');
        });
        Schema::create('community_development_program_talent_nomination', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->foreignUuid('community_development_program_id')
                ->constrained('community_development_program', 'id')
                ->onDelete('cascade');
            $table->foreignUuid('talent_nomination_id')
                ->constrained('talent_nominations', 'id')
                ->onDelete('cascade');
            $table->unique(['community_development_program_id', 'talent_nomination_id'], 'community_development_program_talent_nomination_unique');
        });

        // fill data
        // community development program - talent event pivot
        $developmentProgramTalentNominationEvents = DB::table('development_program_talent_nomination_event')
            ->join('talent_nomination_events', 'talent_nomination_events.id', '=', 'development_program_talent_nomination_event.talent_nomination_event_id')
            ->join('development_programs', 'development_programs.id', '=', 'development_program_talent_nomination_event.development_program_id')
            ->select(
                'development_program_id',
                'talent_nomination_event_id',
                'development_programs.description_for_nominations',
                'talent_nomination_events.community_id'
            )
            ->get();
        foreach ($developmentProgramTalentNominationEvents as $iteration) {
            $communityId = $iteration->community_id;
            $developmentProgramId = $iteration->development_program_id;
            $talentNominationEventId = $iteration->talent_nomination_event_id;
            $descriptionForNominationEvent = $iteration->description_for_nominations;

            DB::table('community_development_program')
                ->updateOrInsert(
                    ['community_id' => $communityId, 'development_program_id' => $developmentProgramId],
                    []
                );
            $communityDevelopmentProgramId = DB::table('community_development_program')
                ->where('community_id', $communityId)
                ->where('development_program_id', $developmentProgramId)
                ->sole()
                ->id;
            DB::table('community_development_program_talent_nomination_event')
                ->insert([
                    'community_development_program_id' => $communityDevelopmentProgramId,
                    'talent_nomination_event_id' => $talentNominationEventId,
                    'description_for_nominations' => $descriptionForNominationEvent,
                ]);
        }

        // fill data
        // community development program - talent nomination pivot
        $developmentProgramTalentNominations = DB::table('development_program_talent_nomination')
            ->join('talent_nominations', 'talent_nominations.id', '=', 'development_program_talent_nomination.talent_nomination_id')
            ->join('talent_nomination_events', 'talent_nomination_events.id', '=', 'talent_nominations.talent_nomination_event_id')
            ->select(
                'development_program_id',
                'talent_nomination_id',
                'community_id'
            )
            ->get();
        foreach ($developmentProgramTalentNominations as $iteration) {
            $communityId = $iteration->community_id;
            $developmentProgramId = $iteration->development_program_id;
            $talentNominationId = $iteration->talent_nomination_id;

            DB::table('community_development_program')
                ->updateOrInsert(
                    ['community_id' => $communityId, 'development_program_id' => $developmentProgramId],
                    []
                );

            $communityDevelopmentProgramId = DB::table('community_development_program')
                ->where('community_id', $communityId)
                ->where('development_program_id', $developmentProgramId)
                ->sole()
                ->id;

            DB::table('community_development_program_talent_nomination')
                ->insert([
                    'community_development_program_id' => $communityDevelopmentProgramId,
                    'talent_nomination_id' => $talentNominationId,
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_development_program_talent_nomination');
        Schema::dropIfExists('community_development_program_talent_nomination_event');
    }
};
