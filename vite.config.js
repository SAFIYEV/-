import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: 'index.html'
        }
    },
    server: {
        port: 3000,
        open: true
    },
    optimizeDeps: {
        include: ['@supabase/supabase-js', 'three']
    },
    resolve: {
        dedupe: ['@supabase/supabase-js']
    }
});