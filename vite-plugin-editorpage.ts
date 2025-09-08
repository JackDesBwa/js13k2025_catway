import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

export default function EditorPagePlugin(): Plugin {
  return {
    name: 'vite-plugin-editor-page',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/edit.html') {
          const filePath = path.resolve(process.cwd(), 'edit.html')
          if (fs.existsSync(filePath)) {
            const html = fs.readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
            return
          } else {
            res.statusCode = 404
            res.end('edit.html not found')
            return
          }
        }
        next()
      })
    }
  }
}
