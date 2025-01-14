import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';

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
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: extensions,
      loader: { '.js': 'jsx' },
    },
    exclude: ['react-native-document-picker'], // Exclude from dependency optimization
  },
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, 'node_modules/react-native-web'),
      'react-native/Libraries/Animated/NativeAnimatedHelper':
      'react-native-web/dist/cjs/exports/Animated/NativeAnimatedHelper',
      'react-native-reanimated': 'react-native-web-reanimated', // Reanimated for web
      'react-native/Libraries/TurboModule/TurboModuleRegistry': path.resolve(
        __dirname,
        'src/stubs/TurboModuleRegistry.js'
      ), // Stub TurboModuleRegistry
    },
    extensions: extensions,
  },
  plugins: [viteCommonjs(), react()], // Include viteCommonjs plugin
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Allow CommonJS and ES Modules together
    },
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