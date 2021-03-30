const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
// 监听 error
redisClient.on('error', err => {
    console.error(err)
})

function set (key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    // set 的 key 和 val 必须都是字符串
    redisClient.set(key, val, redis.print())
}

function get (key) {
    // get 是异步的，需要用 promise 封装
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val == null) {
                resolve(null)
                return
            }

            try {
                resolve(
                    JSON.parse(val)
                )
            } catch (e) {
                resolve(val)
            }
        })
    })
}

module.exports = {
    set,
    get
}
