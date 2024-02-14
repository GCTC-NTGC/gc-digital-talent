<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->string('key')->nullable(false);
            $table->jsonb('value')->nullable(true);
            $table->unique(['key']);
        });

        DB::table('settings')->insert(
            [
                'key' => 'maintenance_announcement',
                'value' => json_encode([
                    'isEnabled' => false,
                    'publishDate' => Carbon::today()->toDateTimeString(),
                    'expiryDate' => Carbon::today()->toDateTimeString(),
                    'message' => [
                        'en' => 'default message',
                        'fr' => 'message par défaut',
                    ],
                ]),
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
