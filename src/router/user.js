const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 实现 1 个接口
const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录接口
    if (method === 'POST' && req.path === '/api/user/login') {
    // if (method === 'GET' && req.path === '/api/user/login') {
        const { username, password } = req.body
        // req.query: 是获取 GET 方法中的参数
        // const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 设置 session
                req.session.username = data.username
                req.session.realname = data.realname

                // console.log('req.session is', req.session)

                return new SuccessModel('登录成功')
            }
            return new ErrorModel('登录失败')
        })
    }

    /*// test
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) {
            return Promise.resolve(
                new SuccessModel(
                    {session: req.session}
                )
            )
        }
        return Promise.resolve  (
            new ErrorModel('尚未登录')
        )
    }*/
}

module.exports = handleUserRouter
