<?php

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
        Schema::table('personal_experiences', function (Blueprint $table) {
            $table->text('learning_description')->nullable();
            $table->string('organization')->nullable();
        });

        DB::statement(<<<'SQL'
            UPDATE personal_experiences
                SET learning_description =
                    CONCAT_WS(CHR(10), "description", "details")
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personal_experiences', function (Blueprint $table) {
            $table->dropColumn('learning_description');
            $table->dropColumn('organization');
        });
    }
};
