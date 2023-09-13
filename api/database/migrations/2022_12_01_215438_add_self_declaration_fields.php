<?php

use App\Providers\IndigenousCommunity;
use Database\Helpers\ApiEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('indigenous_declaration_signature')->nullable()->default(null);
            $table->jsonb('indigenous_communities')->nullable()->default(null);
        });

        DB::statement(
            <<<'SQL'
                UPDATE users
                    SET indigenous_communities =
                        case is_indigenous
                            when true then :isIndigenous::jsonb
                            when false then :emptyArray::jsonb
                        end
            SQL, [
                'isIndigenous' => json_encode([IndigenousCommunity::LEGACY_IS_INDIGENOUS->name]),
                'emptyArray' => json_encode([]), // empty array maps is_indigenous = false to the new format and enables accurate reversal
            ]
        );

        DB::statement(
            <<<'SQL'
                UPDATE users
                    SET indigenous_declaration_signature =
                        case is_indigenous
                            when true then :placeholder
                            when false then :placeholder
                        end
            SQL, [
                'placeholder' => 'migrated 2022 december',
            ]
        );

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_indigenous');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_indigenous')->nullable()->default(null);
        });

        DB::statement(
            <<<'SQL'
                UPDATE users
                    SET is_indigenous =
                        case
                            when (jsonb_array_length(indigenous_communities) > 0) then true
                            when not (jsonb_array_length(indigenous_communities) > 0) then false
                        end
            SQL, []
        );

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('indigenous_communities');
            $table->dropColumn('indigenous_declaration_signature');
        });
    }
};
