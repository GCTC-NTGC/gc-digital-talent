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
        Schema::table('pools', function (Blueprint $table) {
            $table->string('area_of_selection')->nullable(true);
            $table->jsonb('selection_limitations')->nullable(false)->default(json_encode([]));
        });

        DB::table('pools')
            ->whereNotNull('published_at')
            ->update(['area_of_selection' => 'PUBLIC']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('area_of_selection');
            $table->dropColumn('selection_limitations');
        });
    }
};
