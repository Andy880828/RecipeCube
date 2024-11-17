import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';

const host = 'localhost';

// 確保憑證檔案存在的函數
function getCertificates() {
    const certPath = path.resolve(__dirname, 'certs');
    try {
        return {
            key: fs.readFileSync(path.resolve(certPath, 'key.pem')),
            cert: fs.readFileSync(path.resolve(certPath, 'cert.pem')),
        };
    } catch (e) {
        console.warn('SSL certificates not found. HTTPS will not be available.');
        return false;
    }
}

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
    base: '/',
    server: {
        https: getCertificates(),
        host,
        port: 5173,
        hmr: {
            host,
            protocol: 'wss', // 使用 WSS for HMR
        },
        cors: true,
    },
});
