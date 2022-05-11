<?php

namespace App\Services\Contracts;

use Lcobucci\JWT\Token\DataSet;

// Need to abstract the Lcobucci\JWT\Token\DataSet class because it is a final class and cannot be mocked
Interface DataSetInterface extends DataSet
{ }
