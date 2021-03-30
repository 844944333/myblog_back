const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 设置 cookie 的过期时间
const getCookieExpires = () => {
    // 获取当前时间作为 cookie 的过期时间
    const d = new Date()
    // 设置 cookie 一天后无效
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    // console.log('d.toUTCString()', d.toUTCString())
    return d.toUTCString()
}

// session 数据
const SESSION_DATA = {}

// 用于处理 post 的数据
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            // chunk 前端发送过来的数据
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
}

const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-Type', 'application/json')
    const url = req.url
    req.path = url.split('?')[0]

    // 解析 query
    req.query = querystring.parse(url.split('?')[1])

    // 解析 cookie
    req.cookie = {}
    console.log('req.headers.cookie', req.headers.cookie)
    const cookieStr = req.headers.cookie || ''      // k1=v1;k2=v2;k3=v3
    // 将 cookie 通过 ; 来拆分成数组
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        // 将数组元素通过 = 来拆分成数组
        const arr = item.split('=')
        // 去掉前后的空格，让客户端修改的 cookie 无效
        const key = arr[0].trim()
        const val = arr[1]
        // { k1: 'v1', k2: 'v2' }
        req.cookie[key] = val
    })

    // 解析 session
    // 判断是否需要设置 cookie, 默认不需要
    let needSetCookie = false
    let userId = req.cookie.userId
    // 判断是否有 userId
    if (userId) {
        // 如果有 userId 就看 SESSION_DATA 中有没有对应的值
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        // 如果没有 userId 就要设置 cookie
        needSetCookie = true
        // 没有 userId 的话就给它赋值时间戳
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]

    // 处理 post data
    getPostData(req).then(postData => {
        // 前端发送过来的数据
        req.body = postData     // 所有的路由都可以通过 req.body 来获取 postData 的数据

        // 处理 blog 路由
        /* const blogData = handleBlogRouter(req, res)
        if (blogData) {
            res.end(JSON.stringify(blogData))
            return
        } */
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                /* if (needSetCookie) {
                    // 操作 cookie
                    // 如果 path  不设置为根路由/，这个 cookie 就只在当前路由的页面生效，设置为根路由就是这个网站的所有页面(路由)都生效
                    // httpOnly: 设置 cookie 只允许后端修改，不允许前端修改，在解析 cookie 时需要去掉前后的空格
                    // expires:  设置 cookie 的过期时间
                    res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                } */
                res.end(JSON.stringify(blogData))
            })
            return
        }

        // 处理 user 路由
        /*const userData = handleUserRouter(req, res)
        if (userData) {
            res.end(JSON.stringify(userData))
            return
        }*/
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    // 操作 cookie
                    // 如果 path  不设置为根路由/，这个 cookie 就只在当前路由的页面生效，设置为根路由就是这个网站的所有页面(路由)都生效
                    // httpOnly: 设置 cookie 只允许后端修改，不允许前端修改，在解析 cookie 时需要去掉前后的空格
                    // expires:  设置 cookie 的过期时间
                    res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }

        // 未命中任何路由，返回纯文本 ( text/plain )
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.end('404 Not Found')
    })

}

module.exports = serverHandle

// process.env.NODE_ENV
