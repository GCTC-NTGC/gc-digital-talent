<?php

use App\Models\PoolCandidate;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->string('veteran_verification')->nullable();
            $table->date('veteran_verification_expiry')->nullable();
            $table->string('priority_verification')->nullable();
            $table->date('priority_verification_expiry')->nullable();
        });

        PoolCandidate::whereHas('user', function (Builder $query) {
            $query->where('armed_forces_status', 'VETERAN');
        })->update(['veteran_verification' => 'UNVERIFIED']);
        PoolCandidate::whereHas('user', function (Builder $query) {
            $query->where('has_priority_entitlement', true);
        })->update(['priority_verification' => 'UNVERIFIED']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('veteran_verification');
            $table->dropColumn('veteran_verification_expiry');
            $table->dropColumn('priority_verification');
            $table->dropColumn('priority_verification_expiry');
        });
    }
};
