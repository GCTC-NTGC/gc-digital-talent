<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('gen_random_uuid()'));
            $table->string('key')->unique();
            $table->jsonb('title')->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('message')->default(json_encode(['en' => '', 'fr' => '']));
            $table->boolean('is_enabled')->default(false);
            $table->boolean('is_dismissible')->default(false);
            $table->timestamp('publish_date')->nullable();
            $table->timestamp('expiry_date')->nullable();
            $table->timestamps();
        });

        $row = DB::table('settings')->where('key', 'sitewide_announcement')->first(['value']);
        if ($row && $row->value) {
            $data = json_decode($row->value, true);
            DB::table('announcements')->insert([
                'key' => 'sitewide_announcement',
                'is_enabled' => (bool) ($data['isEnabled'] ?? false),
                'is_dismissible' => (bool) ($data['isDismissible'] ?? false),
                'publish_date' => $data['publishDate'] ?? null,
                'expiry_date' => $data['expiryDate'] ?? null,
                'title' => json_encode($data['title'] ?? ['en' => '', 'fr' => '']),
                'message' => json_encode($data['message'] ?? ['en' => '', 'fr' => '']),
                'created_at' => now(),
                'updated_at' => $data['updatedAt'] ?? now(),
            ]);
        }

        Schema::dropIfExists('settings');
    }

    public function down(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->jsonb('value')->nullable();
        });

        $announcement = DB::table('announcements')->where('key', 'sitewide_announcement')->first();
        if ($announcement) {
            DB::table('settings')->insert([
                'key' => 'sitewide_announcement',
                'value' => json_encode([
                    'isEnabled' => (bool) $announcement->is_enabled,
                    'isDismissible' => (bool) $announcement->is_dismissible,
                    'publishDate' => $announcement->publish_date,
                    'expiryDate' => $announcement->expiry_date,
                    'title' => json_decode($announcement->title, true),
                    'message' => json_decode($announcement->message, true),
                    'updatedAt' => $announcement->updated_at,
                ]),
            ]);
        }

        Schema::dropIfExists('announcements');
    }
};
