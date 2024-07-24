<?php

use App\Models\Community;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // create new community_id column
        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('community_id')->nullable();
            $table->foreign('community_id')->references('id')->on('communities');
        });

        $communitiesExist = count(Community::all()) != 0;
        if ($communitiesExist) { // do not run on migrate:fresh
            $communityATIP = Community::where('key', 'atip')->sole()->id;
            $communityDigitalCommunity = Community::where('key', 'digital')->sole()->id;

            // fill new community_id column based on stream
            DB::statement(
                <<<'SQL'
                UPDATE pools
                    SET community_id =
                        case stream
                            when :atipStream then :atipCommunity::uuid
                            else :digitalCommunity::uuid
                        end
            SQL, [
                    'atipStream' => 'ACCESS_INFORMATION_PRIVACY',
                    'atipCommunity' => $communityATIP,
                    'digitalCommunity' => $communityDigitalCommunity,
                ]
            );
        }

        // now that it's filled, make non-nullable
        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('community_id')->nullable(false)->change();  // TODO, double-check when upgrading to Laravel 11
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('community_id');
        });
    }
};
