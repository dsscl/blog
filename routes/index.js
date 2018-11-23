var crypto = require('crypto'); // Node.js的一个核心模块，用它生成散列值来加密密码
var User = require('../models/user.js');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '主页' });
});

router.get('/reg', function(req, res) {
  res.render('reg', { title: '注册' } )
})

router.post('/reg', function(req, res) {
  var name = req.body.name,
  password = req.body.password,
  password_re = req.body['password-repeat']
  // 检验用户两次输入的密码是否一致
  if(password_re !== password) {
    req.flash('error', '两次输入的密码不一致！')
    return res.redirect('/reg')
  }
  // 生成密码的md5值
  var md5 = crypto.createHash('md5'),
  password = md5.update(req.body.password).digest('hex')
  var newUser = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
  })
  // 检查用户是否已经存在
  User.get(newUser.name, function(err, user) {
    if(err) {
      req.flash('error', err)
      return res.redirect('/')
    }
    if(user) {
      req.flash('error', err)
      return res.redirect('/reg')
    }
    // 如果不存在则新增用户
    newUser.save(function(err, user) {
      if(err) {
        req.flash('error', err)
        return res.redirect('/reg')
      }
      req.session.user = user  // 用户信息存入session，之后就可以通过req.session.user读取用户信息
      req.flash('success', '注册成功！')
      res.redirect('/')
    })
  })
})

router.get('/login', function(req, res) {
  res.render('login', { title: '登录' } )
})

router.post('/login', function(req, res) {
})

router.get('/post', function(req, res) {
  res.render('post', { title: '发表' } )
})

router.post('/post', function(req, res) {
})

router.get('/logout', function(req, res) {
})

module.exports = router;
