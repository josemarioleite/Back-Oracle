const oracledb = require('oracledb')
const dbConfig = require('../config/dbconfig')
const bcrypt = require('bcrypt-nodejs')
const counter = require('counter')
var count = counter(Math.random() * 100)

module.exports = app => {
    const createUser = function (req, res, next) {
        const obterHash = (password, callback) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
            })
        }
        const todo = req.body
        const tableUser = 
            'INSERT INTO your-table-user' +
            '(' +
            'IDUSER,' + 
            'NAMEUSER,' +
            'PASSWDUSER,' +
            'CODFILIALUSER,' +
            'CODSETORUSER' +

            ') values ( ' +
            'MCIDUSER.nextval,' +
            ':NAMEUSER,' +
            ':PASSWDUSER,' +
            ':CODFILIALUSER,' +
            ':CODSETORUSER' +
            ')'

        const connect = oracledb.getConnection(dbConfig, function(getErr, conn){
            if(getErr) {
                next(getErr.message)
                return
            }
            obterHash(todo.PASSWDUSER, hash => {
                const passworder = hash
                conn.execute(
                    tableUser, {
                        // IDUSER: count.value ++, // Não precisa chamar este parâmetro, no próprio Oracle faz o Auto_Increment com Sequence.
                        NAMEUSER: todo.NAMEUSER,
                        PASSWDUSER: passworder,
                        CODFILIALUSER: todo.CODFILIALUSER,
                        CODSETORUSER: todo.CODSETORUSER
                    },            
                    {
                        autoCommit: true,
                        outFormat: oracledb.OBJECT
                    }, 
                function(err, result){
                    if(err){
                        next(err)
                        return
                    }
                    conn.release(function (getError) {
                        if(getError){
                            next(getError.message)
                            return
                        }
                        else {
                            console.log('Criado com sucesso!')
                        }
                        res.status(501).json(todo)
                        res.send(JSON.stringify(result.rows))
                    })
                })
            })
            return connect
        })
    }
    return {createUser}
}