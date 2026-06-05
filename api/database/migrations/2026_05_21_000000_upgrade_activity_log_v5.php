<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    public function up(): void
    {
        Schema::table('activity_log', function (Blueprint $table) {
            $table->json('attribute_changes')->nullable()->after('causer_id');
            $table->dropColumn('batch_uuid');
        });

        // Extract 'attributes' and 'old' keys from properties into attribute_changes
        DB::statement("
            UPDATE activity_log
            SET attribute_changes = (
                CASE
                    WHEN jsonb_exists_any(properties::jsonb, ARRAY['attributes', 'old'])
                    THEN (
                        SELECT jsonb_object_agg(key, value)
                        FROM jsonb_each(properties::jsonb)
                        WHERE key IN ('attributes', 'old')
                    )
                    ELSE NULL
                END
            )::text::json
            WHERE properties IS NOT NULL
        ");

        // Remove those keys from properties, nulling out empty objects
        DB::statement("
            UPDATE activity_log
            SET properties = (
                CASE
                    WHEN (properties::jsonb - 'attributes' - 'old') = '{}'::jsonb
                    THEN NULL
                    ELSE (properties::jsonb - 'attributes' - 'old')::text::json
                END
            )
            WHERE properties IS NOT NULL
        ");
    }

    public function down(): void
    {
        Schema::table('activity_log', function (Blueprint $table) {
            $table->uuid('batch_uuid')->nullable();
            $table->dropColumn('attribute_changes');
        });
    }
};
