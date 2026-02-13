const { withAppBuildGradle } = require("expo/config-plugins");

/**
 * Config plugin to remove enableBundleCompression from app/build.gradle.
 * This property was added in RN 0.77+ but Expo SDK 54 uses RN 0.76.6
 * where it doesn't exist yet.
 */
module.exports = function withFixBuildGradle(config) {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /\s*enableBundleCompression\s*=.*\n/g,
      "\n"
    );
    return config;
  });
};
