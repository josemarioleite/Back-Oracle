module.exports = app => {
    app.delete('/deleter', app.api.methodDelete.deleter)
    // app.post('/answers', app.api.methodPost.postter)

    app.route('/answers')
        .all(app.config.passport.authenticate())
        .post(app.api.methodPost.postter)

    app.post('/signup', app.api.methodCreateUser.createUser)
    // app.route('/signup')
    //     .all(app.config.passport.authenticate())
    //     .post(app.api.methodCreateUser.createUser)

    app.get('/resps', app.api.methodGetAnswer.getResp)
    app.get('/users', app.api.methodGetUsers.getUser)
    app.get('/users/:IDUSER', app.api.methodGetUserById.getByID)
    app.get('/quests/:CODSETOR', app.api.methodGetQuests.getter)

    app.post('/signin', app.api.methodAuth.entryUser)
    app.post('/validatetoken', app.api.methodAuth.validarToken)
}