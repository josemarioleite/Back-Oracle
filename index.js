const consign = require('consign')
const express = require('express')
const app = express()
const port = 8877

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.listen(port, () => {
    console.log(`Back-end, porta: ${port}`)
})