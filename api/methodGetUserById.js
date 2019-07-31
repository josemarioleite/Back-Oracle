const oracledb = require('oracledb')
const dbConfig = require('../config/dbconfig')

module.exports = app => {
    const getByID = function(req, res, next) {
        const todo = req.params
        const userID = `SELECT * FROM your-table-user WHERE IDUSER = :IDUSER`
        const connect = oracledb.getConnection(dbConfig, function (getError, conn){
            if (getError) {
                next(getError.message)
                return 
            }
            conn.execute(userID, {
                IDUSER: todo.IDUSER
            }, 
            {
                autoCommit: true,
                outFormat: oracledb.OBJECT
            },
            function(err, result){
                if (err) {
                    next(err.message)
                    return
                }
                else {                    
                    res.contentType('application/json').status(200)                            
                    res.send(JSON.stringify(result.rows))            
                }
                conn.release(function(error){
                    if (error) {
                        next(error.message)
                        return
                    }
                    else {
                        console.log("Usuário obtido com Sucesso!")
                    }
                })
            })
            return connect            
        })
    }
    return {getByID}       
}