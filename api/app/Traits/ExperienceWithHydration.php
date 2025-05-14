<?php

namespace App\Traits;

use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;
use Illuminate\Database\Eloquent\Model;

trait ExperienceWithHydration
{
    use HydratesSnapshot;

    /**
     * @param  mixed  $snapshot  the snapshot
     * @return array array of experiences
     */
    public static function hydrateSnapshot(mixed $snapshot): Model|array
    {
        $experiences = [];
        foreach ($snapshot as $experience) {
            $hydrationModel = match ($experience['__typename']) {
                'AwardExperience' => AwardExperience::class,
                'CommunityExperience' => CommunityExperience::class,
                'EducationExperience' => EducationExperience::class,
                'PersonalExperience' => PersonalExperience::class,
                'WorkExperience' => WorkExperience::class,
                default => null,
            };

            if ($hydrationModel) {
                $fields = [
                    ...$hydrationModel::$hydrationFields,
                    'id' => 'id',
                    'details' => 'details',
                ];

                $model = new $hydrationModel;
                $experiences[] = self::hydrateFields($experience, $fields, $model);
            }
        }

        return $experiences;
    }
}
