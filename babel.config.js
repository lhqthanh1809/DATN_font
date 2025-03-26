module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".tsx", ".ts", ".js", ".json"],
          alias: {
            "@": "./",
            "@pages": "./pages",
          },
        },
      ],
      ["react-native-reanimated/plugin", { disableReduceMotion: true }],
    ],
  };
};
