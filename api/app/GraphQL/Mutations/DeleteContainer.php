<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use MicrosoftAzure\Storage\Blob\BlobRestProxy;
use MicrosoftAzure\Storage\Common\Exceptions\ServiceException as ExceptionsServiceException;

final readonly class DeleteContainer
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $connectionString = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://azurite:10000/devstoreaccount1;QueueEndpoint=http://azurite:10001/devstoreaccount1;TableEndpoint=http://azurite:10002/devstoreaccount1;";
        $blobClient = BlobRestProxy::createBlobService($connectionString);

        try {
            // Create container.
            $containerName = "mycontainer";
            $blobClient->deleteContainer($containerName) . PHP_EOL;
            return "Success!";
        } catch (ExceptionsServiceException $e) {
            $code = $e->getCode();
            $error_message = $e->getMessage();
            return $code.": ".$error_message.PHP_EOL;
        }
    }
}
