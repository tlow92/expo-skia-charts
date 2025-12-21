import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import * as path from "node:path";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import { sources } from "webpack";
import fs from "node:fs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "expo-skia-charts",
  tagline: "Modern performant charts for iOS/Android/Web using Skia",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://tlow92.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/expo-skia-charts/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "tlow92", // Usually your GitHub org/user name.
  projectName: "expo-skia-charts", // Usually your repo name.
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "pages", // Use 'pages' instead of default 'docs'
          routeBasePath: "docs",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/tlow92/expo-skia-charts/tree/main/docs/",
        },
        blog: false, // Disable blog feature
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@gorhom/docusaurus-react-native-plugin",
      {
        alias: {
          "expo-skia-charts": path.resolve(__dirname, "../src/index.tsx"),
          "react-native-reanimated": path.resolve(
            __dirname,
            "../node_modules/react-native-reanimated"
          ),
          "react-native-gesture-handler": path.resolve(
            __dirname,
            "../node_modules/react-native-gesture-handler"
          ),
          "@shopify/react-native-skia": path.resolve(
            __dirname,
            "../node_modules/@shopify/react-native-skia"
          ),
          "react-native/Libraries/Image/AssetRegistry": path.resolve(
            __dirname,
            "./src/stubs/AssetRegistry.js"
          ),
        },
      },
    ],
    function skiaWebPlugin() {
      return {
        name: "skia-web-plugin",
        configureWebpack() {
          return {
            plugins: [
              new (class CopySkiaPlugin {
                apply(compiler) {
                  compiler.hooks.thisCompilation.tap("AddSkiaPlugin", (compilation) => {
                    compilation.hooks.processAssets.tapPromise(
                      {
                        name: "copy-skia",
                        stage:
                          compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                      },
                      async () => {
                        const src = require.resolve(
                          "canvaskit-wasm/bin/full/canvaskit.wasm"
                        );
                        if (!compilation.getAsset(src)) {
                          compilation.emitAsset(
                            "/canvaskit.wasm",
                            new sources.RawSource(await fs.promises.readFile(src))
                          );
                        }
                      }
                    );
                  });
                }
              })(),
              new NodePolyfillPlugin(),
            ],
          };
        },
      };
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "expo-skia-charts",
      logo: {
        alt: "expo-skia-charts Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://github.com/tlow92/expo-skia-charts",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Get Started",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/tlow92/expo-skia-charts",
            },
            {
              label: "npm",
              href: "https://www.npmjs.com/package/expo-skia-charts",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} expo-skia-charts. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
