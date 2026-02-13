const { withGradleProperties } = require("expo/config-plugins");

/**
 * Config plugin to set the Kotlin version in gradle.properties.
 * Fixes KSP compatibility issue with @react-native-firebase pulling
 * Kotlin 1.9.24 which is too old for the EAS build server's KSP.
 */
module.exports = function withKotlinVersion(config, version = "2.0.21") {
  return withGradleProperties(config, (config) => {
    // Remove any existing kotlinVersion property
    config.modResults = config.modResults.filter(
      (item) => !(item.type === "property" && item.key === "kotlinVersion")
    );
    // Add the specified version
    config.modResults.push({
      type: "property",
      key: "kotlinVersion",
      value: version,
    });
    return config;
  });
};
