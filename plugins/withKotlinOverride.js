const {
  withProjectBuildGradle,
  withSettingsGradle,
} = require("expo/config-plugins");

const KOTLIN_VERSION = "2.0.21";

/**
 * Config plugin to force Kotlin 2.0.21 across the entire project.
 *
 * RN 0.76.6's libs.versions.toml hardcodes kotlin=1.9.24, but EAS's Gradle 8.14
 * auto-applies the Kotlin Compose plugin which requires
 * kotlin-compose-compiler-plugin-embeddable (only exists in Kotlin 2.0+).
 *
 * We override in three places:
 * 1. build.gradle - force kotlin-gradle-plugin classpath version
 * 2. settings.gradle - override the version catalog
 */
function withKotlinBuildGradle(config) {
  return withProjectBuildGradle(config, (config) => {
    // Replace the unversioned kotlin-gradle-plugin with an explicit version
    config.modResults.contents = config.modResults.contents.replace(
      "classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')",
      `classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:${KOTLIN_VERSION}')`
    );

    // Add resolution strategy to force Kotlin version for all subprojects
    const forceBlock = `
allprojects {
    configurations.all {
        resolutionStrategy {
            force "org.jetbrains.kotlin:kotlin-stdlib:${KOTLIN_VERSION}"
            force "org.jetbrains.kotlin:kotlin-stdlib-jdk8:${KOTLIN_VERSION}"
            force "org.jetbrains.kotlin:kotlin-reflect:${KOTLIN_VERSION}"
        }
    }
}
`;
    if (!config.modResults.contents.includes("resolutionStrategy")) {
      config.modResults.contents += forceBlock;
    }
    return config;
  });
}

function withKotlinSettingsGradle(config) {
  return withSettingsGradle(config, (config) => {
    // Override the version catalog
    if (!config.modResults.contents.includes("versionCatalogs")) {
      config.modResults.contents += `
dependencyResolutionManagement {
    versionCatalogs {
        libs {
            version("kotlin", "${KOTLIN_VERSION}")
        }
    }
}
`;
    }
    return config;
  });
}

module.exports = function withKotlinOverride(config) {
  config = withKotlinBuildGradle(config);
  config = withKotlinSettingsGradle(config);
  return config;
};
