const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog,
    getBlogClassify,
    getBlogClassifyList
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 同一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登陆')
        )
    }
}

// 实现 5 个接口
const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author
        const keyword = req.query.keyword
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        // const detailData = getDetail(id)
        // return new SuccessModel(detailData)
        const result = getDetail(id)
        return result.then(detailData => {
            return new SuccessModel(detailData)
        })
    }

    // 获取博客分类列表
    if (method === 'GET' && req.path === '/api/blog/classify') {
        const result = getBlogClassify()
        return result.then(classifyData => {
            return new SuccessModel(classifyData)
        })
    }

    // 获取某一分类的博客列表
    if (method === 'GET' && req.path === '/api/blog/classify/list') {
        const name = req.query.name
        console.log('name is', name)
        const result = getBlogClassifyList(name)
        return result.then(classifyListData => {
            return new SuccessModel(classifyListData)
        })
    }

    // 新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        // const data = newBlog(req.body)
        // return new SuccessModel(data)

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }

        req.body.author = req.session.username
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }

        const result = updateBlog(id, req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel(val)
            } else {
                return new ErrorModel('博客更新失败!')
            }
        })
    }

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }

        // const author = 'Trimble'
        const author = req.session.username
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel(val)
            } else {
                return new ErrorModel('博客删除失败!')
            }
        })
    }
}

module.exports = handleBlogRouter
