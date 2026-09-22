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
        Schema::create('platform_metric_snapshots', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));

            // Shape of the metrics payload, so the structure can change without
            // migrating or discarding rows written under an older shape.
            $table->unsignedInteger('version');

            $table->timestamp('computed_at');

            // The whole metrics payload, one key per metric group. A document
            // rather than normalized rows: the resolver maps it straight to
            // GraphQL, and adding a group needs no migration. Each group carries
            // its own windowStart, since a window belongs to what is being
            // measured rather than to the snapshot.
            $table->jsonb('metrics');

            $table->timestamps();

            // Supports "the most recent snapshot of a shape I understand".
            $table->index(['version', 'computed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_metric_snapshots');
    }
};
