const wp = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                //inlineSourceMap: true,
                inlineSources: true,
                downlevelIteration: true,
              },
              logLevel: "error",
              silent: true,
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
};

export default wp;
