const router = require('koa-router')()
const { SuccessModel,ErrorModel } = require('../model/resModel')
const { login } = require('../controller/login')

router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const result = await login( username, password )
  Object.assign(ctx.session, {username: result.username, realname: result.realname})
  ctx.body = result.username ? new SuccessModel('用户登陆成功') : new ErrorModel('用户登陆失败')
})


module.exports = router
