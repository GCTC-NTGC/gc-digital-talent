<!DOCTYPE html>
<html lang="en">
@php use MLL\GraphiQL\DownloadAssetsCommand; @endphp
<head>
    <meta charset=utf-8/>
    <meta name="viewport"
          content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
    <title>GraphiQL</title>
    <style nonce="**CSP_NONCE**">
        body {
            height: 100%;
            margin: 0;
            width: 100%;
            overflow: hidden;
        }

        #graphiql {
            height: 100vh;
        }

        /* Make the explorer feel more integrated */
        .docExplorerWrap {
            overflow: auto !important;
            width: 100% !important;
            height: auto !important;
        }

        .doc-explorer-title-bar {
            font-weight: var(--font-weight-medium);
            font-size: var(--font-size-h2);
            overflow-x: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .doc-explorer-rhs {
            display: none;
        }

        .doc-explorer-contents {
            margin: var(--px-16) 0 0;
        }

        .graphiql-explorer-actions select {
            margin-left: var(--px-12);
        }
    </style>
    <script nonce="**CSP_NONCE**" src="{{ DownloadAssetsCommand::reactPath() }}"></script>
    <script nonce="**CSP_NONCE**"src="{{ DownloadAssetsCommand::reactDOMPath() }}"></script>
    <link nonce="**CSP_NONCE**" rel="stylesheet" href="{{ DownloadAssetsCommand::cssPath() }}"/>
    <link nonce="**CSP_NONCE**" rel="shortcut icon" href="{{ DownloadAssetsCommand::faviconPath() }}"/>
</head>

<body>

<div id="graphiql">Loading...</div>
<script nonce="**CSP_NONCE**" src="{{ DownloadAssetsCommand::jsPath() }}"></script>
<script nonce="**CSP_NONCE**" src="{{ DownloadAssetsCommand::pluginExplorerPath() }}"></script>
<script nonce="**CSP_NONCE**">
    const fetcher = GraphiQL.createFetcher({
        url: '{{ $url }}',
        subscriptionUrl: '{{ $subscriptionUrl }}',
    });

    function GraphiQLWithExplorer() {
        const [query, setQuery] = React.useState('');

        return React.createElement(GraphiQL, {
            fetcher,
            query,
            onEditQuery: setQuery,
            defaultEditorToolsVisibility: true,
            plugins: [
                GraphiQLPluginExplorer.useExplorerPlugin({
                    query,
                    onEdit: setQuery,
                }),
            ],
            // See https://github.com/graphql/graphiql/tree/main/packages/graphiql#props for available settings
        });
    }

    ReactDOM.render(
        React.createElement(GraphiQLWithExplorer),
        document.getElementById('graphiql'),
    );
</script>

</body>
</html>
