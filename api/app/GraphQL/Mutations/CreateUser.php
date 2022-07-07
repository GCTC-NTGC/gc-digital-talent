<?php
namespace App\GraphQL\Mutations;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Nuwave\Lighthouse\Support\ResolveInfo;
use App\Exceptions\CustomException;

class CreateUser
{
    public function __invoke($rootValue, array $args, GraphQLContext $context, $info)
    {
       try{
            // add some code for the validation here 
            throw new CustomException(
                'This is the error message',
                'The reason why this error was thrown, is rendered in the extension output.'
            );

        return $args;

       }
       catch (Exception $e) {
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }

    }
}
