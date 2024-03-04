<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use Illuminate\Support\Facades\Log;
use MicrosoftAzure\Storage\Blob\BlobRestProxy;
use MicrosoftAzure\Storage\Blob\Models\CreateContainerOptions;
use MicrosoftAzure\Storage\Blob\Models\PublicAccessType;
use MicrosoftAzure\Storage\Common\Exceptions\ServiceException as ExceptionsServiceException;
use MicrosoftAzure\Storage\Common\ServiceException;

final readonly class ContainerProperties
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $connectionString = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://azurite:10000/devstoreaccount1;QueueEndpoint=http://azurite:10001/devstoreaccount1;TableEndpoint=http://azurite:10002/devstoreaccount1;";
        $blobClient = BlobRestProxy::createBlobService($connectionString);
        $containerName = "mycontainer";

        $result = "Get container properties:" . PHP_EOL;
        // Get container properties
        $properties = $blobClient->getContainerProperties($containerName);
        $result .= 'Last modified: ' . $properties->getLastModified()->format('Y-m-d H:i:s') . PHP_EOL;
        $result .= 'ETAG: ' . $properties->getETag() . PHP_EOL;
        return $result;
    }
}
