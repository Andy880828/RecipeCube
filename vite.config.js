import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            scss: { api: 'modern-compiler' },
        },
    },
    base: '/',  // 這裡保持為根路徑，或者你也可以設定為 /linetest/ 如果需要
    server: {
        https: {
            key: fs.readFileSync(path.resolve(__dirname, 'certs', 'key.pem')),  // 私鑰檔案路徑
            cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'cert.pem')),  // 憑證檔案路徑
        },
        host: 'localhost',
        port: 5173,
    },
});
