// process: 获取 nodejs 进程的信息
const env = process.env.NODE_ENV        // 环境变量、参数

// 配置
let MYSQL_CONF
let REDIS_CONF

// 本地环境
if (env === 'dev') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'tianbao1999',
        port: '3306',
        database: 'myblog'
    }

    //redis
    REDIS_CONF = {
        host: '124.0.0.1',
        port: 6379
    }
}

// 线上环境
if (env === 'production') {
    // mysql
    // 线上环境需要用线上服务器的数据库
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'tianbao1999',
        port: '3306',
        database: 'myblog'
    }

    //redis
    REDIS_CONF = {
        host: '124.0.0.1',
        port: 6379
    }
}


module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}
