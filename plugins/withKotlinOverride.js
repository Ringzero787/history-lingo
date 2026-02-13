const { withSettingsGradle } = require("expo/config-plugins");

/**
 * Config plugin to override the Kotlin version in React Native's version catalog.
 * RN 0.76.6 hardcodes kotlin=1.9.24 in libs.versions.toml, but the EAS build
 * server's Gradle 8.14 includes the Kotlin Compose plugin which requires
 * kotlin-compose-compiler-plugin-embeddable that only exists in Kotlin 2.0+.
 */
module.exports = function withKotlinOverride(config, version = "2.0.21") {
  return withSettingsGradle(config, (config) => {
    // Add versionCatalogs override block after the existing content
    if (!config.modResults.contents.includes("versionCatalogs")) {
      config.modResults.contents += `
dependencyResolutionManagement {
    versionCatalogs {
        libs {
            version("kotlin", "${version}")
        }
    }
}
`;
    }
    return config;
  });
};
