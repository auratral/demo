import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(), 
        tailwindcss(),
        {
            name: 'subscribers-api',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    const filePath = path.resolve(__dirname, 'subscribers.json')
                    
                    if (req.url === '/api/subscribers') {
                        if (req.method === 'GET') {
                            res.setHeader('Content-Type', 'application/json')
                            let data = []
                            try {
                                if (fs.existsSync(filePath)) {
                                    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
                                }
                            } catch (e) {
                                console.error("Error reading subscribers file:", e)
                            }
                            res.end(JSON.stringify(data))
                            return
                        }
                        
                        if (req.method === 'POST') {
                            let body = ''
                            req.on('data', chunk => {
                                body += chunk
                            })
                            req.on('end', () => {
                                res.setHeader('Content-Type', 'application/json')
                                try {
                                    const newSub = JSON.parse(body)
                                    let data = []
                                    if (fs.existsSync(filePath)) {
                                        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
                                    }
                                    // Deduplicate by email
                                    if (!data.some(s => s.email === newSub.email)) {
                                        data.push(newSub)
                                        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
                                    }
                                    res.end(JSON.stringify({ success: true, count: data.length }))
                                } catch (e) {
                                    res.statusCode = 400
                                    res.end(JSON.stringify({ error: 'Invalid JSON body or write failed' }))
                                }
                            })
                            return
                        }
                    }
                    next()
                })
            }
        }
    ],
    base: process.env.VITE_BASE || './',
})

