import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import { isTypeAliasDeclaration } from 'typescript';
import typescript from '@rollup/plugin-typescript';

const extensions = [
  ".web.tsx",
  ".tsx",
  ".web.ts",
  ".ts",
  ".web.jsx",
  ".jsx",
  ".web.js",
  ".js",
  ".css",
  ".json",
];

export default defineConfig({
  define: {
    global: 'window', // Define `global` for compatibility with some libraries
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'), // Define __DEV__ for React Native
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: extensions,
      loader: { '.js': 'jsx' },
    },
    exclude: ['react-native-document-picker',
            ], // Exclude from dependency optimization
  },
  resolve: {
    alias: {
      'react-native-image-picker': 'react-native-web',
      'react-native': path.resolve(__dirname, 'node_modules/react-native-web'),
      'react-native/Libraries/Animated/NativeAnimatedHelper':
      'react-native-web/dist/cjs/exports/Animated/NativeAnimatedHelper',
      'react-native-reanimated': '/Users/nicolassaade/notcloud_project/TTmigtool/TikTok_Parser/FrontEnd/react-native-reanimated.js', // Reanimated for web
      'react-native/Libraries/TurboModule/TurboModuleRegistry': path.resolve(
        __dirname,
        'src/stubs/TurboModuleRegistry.js'
      ), // Stub TurboModuleRegistry
    },
    extensions: extensions,
  },
  plugins: [viteCommonjs(), react(), typescript()], // Include viteCommonjs plugin
  base: '/static/', // Base path for Django
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Allow CommonJS and ES Modules together
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Example: Split React and React DOM into a separate chunk
        },
      },
      external: ['react-native-document-picker'], // Exclude the library from the bundle
      input: ['./src/main.jsx', './index.html'],
    },
    manifest: true, // Generates a manifest file for hashed assets
  },
  esbuild: {
    loader: 'jsx',
    include: /.*\.jsx?$/,
    exclude: []
  },
  server: {
    port: 3000,
  },
});