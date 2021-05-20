<!DOCTYPE html>

<html>

<head>
    <meta charset=utf-8 />
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
    <title>GraphQL Playground</title>

    <link rel="stylesheet"
          href="<?php echo e(\MLL\GraphQLPlayground\DownloadAssetsCommand::cssPath()); ?>"
    />
    <link rel="shortcut icon"
          href="<?php echo e(\MLL\GraphQLPlayground\DownloadAssetsCommand::faviconPath()); ?>"
    />
    <script src="<?php echo e(\MLL\GraphQLPlayground\DownloadAssetsCommand::jsPath()); ?>"></script>
</head>

<body>

<div id="root"/>
<script type="text/javascript">
    window.addEventListener('load', function () {
        const root = document.getElementById('root');

        GraphQLPlayground.init(root, {
            endpoint: "<?php echo e(url(config('graphql-playground.endpoint'))); ?>",
            subscriptionEndpoint: "<?php echo e(config('graphql-playground.subscriptionEndpoint')); ?>",
        })
    })
</script>

</body>
</html>
<?php /**PATH /var/www/html/lumen-graphql/vendor/mll-lab/laravel-graphql-playground/src/../views/index.blade.php ENDPATH**/ ?>