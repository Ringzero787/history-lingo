module.exports = {
  expo: {
    name: "History Lingo",
    slug: "history-lingo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "history-lingo",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#1a1a2e",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.historylingo.app",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#1a1a2e",
      },
      package: "com.historylingo.app",
      googleServicesFile: "./google-services.json",
    },
    plugins: [
      "expo-router",
      "expo-font",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#1a1a2e",
          image: "./assets/splash-icon.png",
          imageWidth: 200,
        },
      ],
      "./plugins/withFixBuildGradle",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "5ba032f1-a9a2-4b00-830b-84cd55e5617d",
      },
    },
    owner: "ringzero",
  },
};
