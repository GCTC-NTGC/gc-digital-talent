<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Database\Helpers\ApiEnums;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $users = User::all();
        foreach($users as $user) {
            $languageAbility = $user->language_ability;
            // before dropping the field language_ability, execute a data change provided it is non-null
            if ($languageAbility !== null) {

                // only override looking_for_english if it is null
                if ($user->looking_for_english == null) {
                    // play it safe, ENGLISH and BILINGUAL map to true
                    if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_ENGLISH | $languageAbility == ApiEnums::LANGUAGE_ABILITY_BILINGUAL) {
                        $user->looking_for_english = true;
                    }
                    else {
                        $user->looking_for_english = false;
                    }
                }

                // only override looking_for_french if it is null
                if ($user->looking_for_french == null) {
                    // play it safe, FRENCH and BILINGUAL map to true
                    if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_FRENCH | $languageAbility == ApiEnums::LANGUAGE_ABILITY_BILINGUAL) {
                        $user->looking_for_french = true;
                    }
                    else {
                        $user->looking_for_french = false;
                    }
                }

                // only override looking_for_bilingual if it is null
                if ($user->looking_for_bilingual == null) {
                    // only BILINGUAL maps to true
                    if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_BILINGUAL) {
                        $user->looking_for_bilingual = true;
                    }
                    else {
                        $user->looking_for_bilingual = false;
                    }
                }

                $user->save();
            }
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('language_ability');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('language_ability')->nullable()->default(null);
        });

        $users = User::all();
        // conditionally assign the best fitting enum to the re-added field to reverse the migration as best as possible
        foreach($users as $user) {
            $lookingForEnglish = $user->looking_for_english;
            $lookingForFrench = $user->looking_for_french;
            $lookingForBilingual = $user->looking_for_bilingual;

            // only english case
            if ($lookingForEnglish && !$lookingForFrench && !$lookingForBilingual) {
                $user->language_ability = ApiEnums::LANGUAGE_ABILITY_ENGLISH;
            }

            // only french case
            if (!$lookingForEnglish && $lookingForFrench && !$lookingForBilingual) {
                $user->language_ability = ApiEnums::LANGUAGE_ABILITY_FRENCH;
            }

            // bilingual case just depends on the one field being true
            // or ignore the field if english and french are both true
            if (($lookingForBilingual) | ($lookingForEnglish && $lookingForFrench)) {
                $user->language_ability = ApiEnums::LANGUAGE_ABILITY_BILINGUAL;
            }

            $user->save();
            // in all other cases the field stays null, so cases where all fields tested are false/null for instance
        }
    }
};
