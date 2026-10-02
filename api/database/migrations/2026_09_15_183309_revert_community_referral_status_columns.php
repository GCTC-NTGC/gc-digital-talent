<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    private const TABLE = 'community_interests';

    private const COLUMNS = [
        'referral_status',
        'referral_follow_up_date',
        'referral_notes',
        'referral_status_data_updated_at',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table(self::TABLE, function (Blueprint $table) {
            if (Schema::hasColumn(self::TABLE, 'referral_classification_id')) {
                $table->dropConstrainedForeignId('referral_classification_id');
            }

            $columns = array_values(array_filter(self::COLUMNS, function ($column) {
                return Schema::hasColumn(self::TABLE, $column);
            }));

            if (! empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
