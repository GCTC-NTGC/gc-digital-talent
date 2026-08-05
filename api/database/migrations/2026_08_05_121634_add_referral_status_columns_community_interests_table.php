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
        Schema::table('community_interests', function (Blueprint $table) {
            $table->string('referral_status')->default('NEW');
            $table->foreignUuid('referral_classification_id')
                ->nullable()
                ->constrained(table: 'classifications')
                ->nullOnDelete();
            $table->date('referral_follow_up_date')->nullable();
            $table->text('referral_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_interests', function (Blueprint $table) {
            $table->dropColumn(['referral_status', 'referral_follow_up_date', 'referral_notes']);
            $table->dropConstrainedForeignId('referral_classification_id');
        });
    }
};
