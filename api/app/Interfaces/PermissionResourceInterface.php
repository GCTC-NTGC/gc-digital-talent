<?php

namespace App\Interfaces;

use App\Models\Team;

interface PermissionResourceInterface
{
    /**
     * Return the owner of the resource, if it exists.
     *
     * @return string
     */
    public function ownerId();

    /**
     * Return all the teams this resource may be accessed by.
     *
     * @return Team[]
     */
    public function teams();

    public function resourceName(): string;
}
