/* eslint-disable */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { config } from 'dotenv';
config();


export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: process.env.SSL_KEY_PATH,
      cert: process.env.SSL_CERT_PATH,
    },
  },
});