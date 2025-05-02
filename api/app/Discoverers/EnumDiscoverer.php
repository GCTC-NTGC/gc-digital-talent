<?php

namespace App\Discoverers;

use App\Traits\HasLocalization;
use Spatie\StructureDiscoverer\Data\DiscoveredStructure;
use Spatie\StructureDiscoverer\Discover;
use Spatie\StructureDiscoverer\Enums\Sort;

class EnumDiscoverer
{
    private static $sort = Sort::Name;

    private static function path()
    {
        return app_path('Enums');
    }

    public static function discoverEnums()
    {
        return Discover::in(self::path())
            ->enums()
            ->sortBy(self::$sort)
            ->get();
    }

    public static function discoverLocalizedEnums()
    {

        return Discover::in(self::path())
            ->enums()
            ->custom(function (DiscoveredStructure $structure) {
                return in_array(HasLocalization::class, class_uses($structure->getFcqn()));
            })
            ->sortBy(self::$sort)
            ->get();
    }
}
