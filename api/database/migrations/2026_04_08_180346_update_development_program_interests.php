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
        // make outdated column nullable
        // create nullable column
        Schema::table('development_program_interests', function (Blueprint $table) {
            $table->foreignUuid('development_program_id')
                ->nullable(true)
                ->change();
            $table->foreignUuid('community_development_program_id')
                ->nullable(true)
                ->constrained('community_development_program', 'id')
                ->onDelete('cascade'); // should community development programs be deleted when they have community interests?
        });

        // fill in new column
        $developmentProgramInterests = DB::table('development_program_interests')
            ->join('community_interests', 'community_interests.id', '=', 'development_program_interests.community_interest_id')
            ->select(
                'development_program_interests.id as id',
                'development_program_id',
                'community_id',
            )
            ->get();

        foreach ($developmentProgramInterests as $iteration) {
            $developmentProgramInterestId = $iteration->id;
            $communityId = $iteration->community_id;
            $developmentProgramId = $iteration->development_program_id;

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

            DB::table('development_program_interests')
                ->where('id', $developmentProgramInterestId)
                ->update([
                    'community_development_program_id' => $communityDevelopmentProgramId,
                ]);
        }

        // now it can be non-nullable
        Schema::table('development_program_interests', function (Blueprint $table) {
            $table->foreignUuid('community_development_program_id')
                ->nullable(false)
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('development_program_interests', function (Blueprint $table) {
            $table->foreignUuid('development_program_id')
                ->nullable(false)
                ->change();
            $table->dropConstrainedForeignId('community_development_program_id');
        });
    }
};
