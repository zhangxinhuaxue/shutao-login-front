import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import usePluginImport from 'vite-plugin-importer'
import legacy from '@vitejs/plugin-legacy'
import eslint from '@rollup/plugin-eslint'

const MOCK_SERVICE = 'http://user.dev.zhaojiling.com'

function resolve(dir) {
    return path.join(__dirname, dir)
}

export default defineConfig({
    plugins: [
        createVuePlugin(),
        // eslint({
        //     'include': ['./src/**/*.vue', './src/**/*.js']
        // }),
        legacy(),
        usePluginImport({
            libraryName: '@fe/aym-ui',
            libraryDirectory: 'src/components'
        }),
        usePluginImport({
            libraryName: '@fe/buss-ui',
            libraryDirectory: 'src/components'
        })
    ],
    resolve: {
        extensions: ['.vue', '.js', '.json'],
        alias: {
            '@': resolve('src'),
            src: resolve('src')
        }
    },
    optimizeDeps: {
        include: ['mui-icon']
    },
    server: {
        port: 8097,
        proxy: {
            '/auth': MOCK_SERVICE,
            '/cms': MOCK_SERVICE,
            '/common': MOCK_SERVICE,
            '/login': MOCK_SERVICE,
            '/uc': MOCK_SERVICE,
            '/oauth2': MOCK_SERVICE
        }
    },
    build: {
        outDir: '../static-build/syao-static-login',
        target: 'es2015',
        cssCodeSplit: true,  // 启用之后拆分异步chunk的css，视情况开启
        emptyOutDir: true,  // 清空打包目录的提醒
        brotliSize: false,  // 压缩报告，开启消耗性能
        rollupOptions: {
            output: {
                manualChunks: {
                    vendors: ['vue', 'vue-resource', 'vue-router', 'vuex']
                },
                chunkFileNames: ChunkInfo => {
                    let name = ChunkInfo.name
                    if(ChunkInfo.isDynamicEntry) {
                        // 如果是异步加载的入口文件，根据文件路径来命名
                        const arr = Object.keys(ChunkInfo.modules)
                        const path = arr[arr.length-1]
                        const pathArr = path.split('/')
                        if(pathArr[pathArr.length-1].includes('.vue')) {
                            name = path.split('/src/')[1].replace(/\.vue$/, '').replace(/\/index$/, '').replace(/^module\//, '').replace(/\//g, '_')
                        }
                    }
                    return 'assets/'+name+'.[hash].js'
                }
            },
            plugins: []
        }
    }
})
