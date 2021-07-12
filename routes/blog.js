const router = require('koa-router')()

const loginCheck = require('../middleware/loginCheck')
const { SuccessModel,ErrorModel } = require('../model/resModel')
const { getBlogList, getBlogDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')

router.prefix('/api/blog')

// 博客列表
router.get('/list', async (ctx, next) => {
  let {author = null, keyword = null} = ctx.query
    if(ctx.query.isadmin) {
      if(!ctx.session.username) return ctx.body = new ErrorModel('未登录')
      // 强制查询自己的博客
      author = ctx.session.username
    }
    const result = await getBlogList(author, keyword)
    ctx.body = new SuccessModel(result, '博客列表查询成功')
})

// 博客详情
router.get('/detail', async (ctx, next) => {
  const { id = null } = ctx.query
  if (!id) return ctx.body = new ErrorModel('请输入博客id')
  const result = await getBlogDetail(id)
  ctx.body = new SuccessModel(result, '博客详情查询成功')
})

// 添加博客
router.post('/new', loginCheck, async (ctx, next) => {
  ctx.request.body.author = ctx.session.username
  const result = await newBlog(ctx.request.body)
  ctx.body = new SuccessModel(result, '新增博客成功')
})

// 编辑博客
router.post('/update', loginCheck, async (ctx, next) => {
  const { id } = ctx.query
  const result = await updateBlog(id, ctx.request.body)
  ctx.body = result ? new SuccessModel('博客编辑成功') : new ErrorModel('博客编辑失败')
})

// 删除博客
router.post('/del', loginCheck, async (ctx, next) => {
  const { id } = ctx.query
  const author = ctx.session.username
  const result = await deleteBlog(id, author)
  ctx.body = result ? new SuccessModel('博客删除成功') : new ErrorModel('博客删除失败')
})

module.exports = router
