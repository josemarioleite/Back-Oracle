const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const oracledb = require('oracledb')
const dbConfig = require('../config/dbconfig')

module.exports = app => {
    const entryUser = async function (req, res, next) {
        const todo = req.body
        const sqlCommand =
            ' select IDUSER,' +
            ' NAMEUSER, ' +
            ' PASSWDUSER, ' +
            ' CODFILIALUSER, ' +
            ' CODSETORUSER ' +
            ' from your-table-user ' +
            ' where NAMEUSER = :NAMEUSER '

        if (!todo.NAMEUSER || !todo.PASSWDUSER) {
            return res.status(400).send('Dados Incompletos')
        }

        const user = await oracledb.getConnection(dbConfig, function (getError, conn) {
            if (getError) {
                next(getError.message)
                return
            }
            conn.execute(
                sqlCommand,
                {
                    NAMEUSER: todo.NAMEUSER
                },
                {
                    autoCommit: true,
                    outFormat: oracledb.OBJECT
                },
                function (err, result) {
                    if (err) {
                        next(err.message)
                        return
                    }
                    var user = res.send(JSON.stringify(result.rows))

                    if (user) {
                        bcrypt.compare(todo.PASSWDUSER, user.PASSWDUSER, function (error, isMatch) {
                            if (error) {
                                next(error.message)
                                return
                            }

                            if (!isMatch) {
                                res.status(401).send({
                                    message: 'E-mail/Senha inválidos, Tente Novamente.'
                                })
                                return
                            }
                            const now = Math.floor(Date.now() / 1000)
                            const payload = {
                                IDUSER: user.IDUSER,
                                iat: now,
                                exp: now + (60 * 60 * 24 * 3)
                            }

                            res.json({
                                NAMEUSER: user.NAMEUSER,
                                CODFILIALUSER: user.CODFILIALUSER,
                                CODSETORUSER: user.CODSETORUSER,
                                token: jwt.encode(payload, authSecret),
                            })
                        })
                    }
                    else {
                        res.status(400).send('Usuário não cadastrado!')
                    }
                })
            return user
        })
    }

    const validarToken = () => {
        const validateToken = async function (req, res) {
            const userData = req.body || null
            try {
                if (userData) {
                    const token = jwt.decode(userData.token, authSecret)
                    if (new Date(token.exp * 1000) > new Date()) {
                        return res.send(true)
                    }
                }
            }
            catch (err) {
                res.status(400).send('Não Válido!')
            }
            res.send(false)
        }
        return validateToken
    }
    return { entryUser, validarToken }
}