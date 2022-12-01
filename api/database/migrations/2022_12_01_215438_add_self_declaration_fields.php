<?php

use Database\Helpers\ApiEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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
            <<<SQL
                UPDATE users
                    SET indigenous_communities =
                        case is_indigenous
                            when true then :isIndigenous::jsonb
                            when false then :emptyArray::jsonb
                        end
            SQL, [
                'isIndigenous' => json_encode([ApiEnums::INDIGENOUS_LEGACY_IS_INDIGENOUS]),
                'emptyArray' => json_encode([]), // empty array maps is_indigenous = false to the new format and enables accurate reversal
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
            <<<SQL
                UPDATE users
                    SET is_indigenous =
                        case
                            when indigenous_communities ?? :legacy then true
                            when not indigenous_communities ?? :legacy then false
                        end
            SQL, [
                'legacy' => ApiEnums::INDIGENOUS_LEGACY_IS_INDIGENOUS,
            ]
        );

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('indigenous_communities');
            $table->dropColumn('indigenous_declaration_signature');
        });
    }
};
