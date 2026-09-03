<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('talent_nomination_groups', function (Blueprint $table) {
            $table->renameColumn('classification_at_time_of_advancement_approval_id', 'classification_at_time_of_last_approval_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('talent_nomination_groups', function (Blueprint $table) {
            $table->renameColumn('classification_at_time_of_last_approval_id', 'classification_at_time_of_advancement_approval_id');
        });
    }
};
