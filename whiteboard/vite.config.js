import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite 配置
    define: {
      'process.env': `${JSON.stringify(env)}`
    },
    plugins: [react()],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }]
    },
    server: {
      host: '0.0.0.0',
      port: 9095
    }
  }
})
