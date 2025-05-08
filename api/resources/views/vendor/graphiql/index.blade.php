>{{-- See https://github.com/graphql/graphiql/blob/main/examples/graphiql-cdn/index.html. --}}
@php
use MLL\GraphiQL\GraphiQLAsset;
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GraphiQL</title>
    <style nonce="**CSP_NONCE**">
        body {
            height: 100%;
            margin: 0;
            width: 100%;
            overflow: hidden; /* in Firefox */
        }

        #graphiql {
            height: 100dvh;
        }

        #graphiql-loading {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
        }
    </style>
    <script nonce="**CSP_NONCE**" src="{{ GraphiQLAsset::reactJS() }}"></script>
    <script nonce="**CSP_NONCE**" src="{{ GraphiQLAsset::reactDOMJS() }}"></script>
    <link nonce="**CSP_NONCE**" rel="stylesheet" href="{{ GraphiQLAsset::graphiQLCSS() }}"/>
    <link nonce="**CSP_NONCE**" rel="stylesheet" href="{{ GraphiQLAsset::pluginExplorerCSS() }}"/>
    <link nonce="**CSP_NONCE**" rel="shortcut icon" href="{{ GraphiQLAsset::favicon() }}"/>
</head>

<body>

<div id="graphiql">
    <div id="graphiql-loading">Loading…</div>
</div>

<script nonce="**CSP_NONCE**" src="{{ GraphiQLAsset::graphiQLJS() }}"></script>
<script nonce="**CSP_NONCE**" src="{{ GraphiQLAsset::pluginExplorerJS() }}"></script>
<script nonce="**CSP_NONCE**">
    const fetcher = GraphiQL.createFetcher({
        url: '{{ $url }}',
        subscriptionUrl: '{{ $subscriptionUrl }}',
    });
    const explorer = GraphiQLPluginExplorer.explorerPlugin();

    function GraphiQLWithExplorer() {
        return React.createElement(GraphiQL, {
            fetcher,
            plugins: [
                explorer,
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
