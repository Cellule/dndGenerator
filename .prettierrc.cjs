module.exports = {
  printWidth: 160,
  trailingComma: "all",
  // Plugins are now loaded explicitly
  pluginSearchDirs: false,
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      options: {
        parser: "typescript",
        plugins: ["prettier-plugin-organize-imports"],
      },
    },
  ],
};
