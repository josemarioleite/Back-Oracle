const oracledb = require('oracledb')
const dbConfig = require('../config/dbconfig')

module.exports = app => {
    const getter = function (req, res, next) {
        const todo = req.params
        const getQuest = `select COLUMN-YOUT-TABLE from your-table-quests where CODSETOR = :CODSETOR`
        const connect = oracledb.getConnection(dbConfig, function (getError, conn) {
            if (getError) {
                next(getError.message)
                    return
            }
            conn.execute(
                getQuest, 
                {
                    // Passar aqui os Parâmetros da requisição (No momento não é necessário)
                    CODSETOR: todo.CODSETOR
                }, 
                {
                    autoCommit: true,
                    outFormat: oracledb.OBJECT
                },
            function (error, result){ 
                if (error) {
                    next(error.message)
                    return
                }
                else {
                    res.contentType('application/json').status(200)                            
                    res.send(JSON.stringify(result.rows))
                }
                conn.release(function (err) {
                    if (err){
                        next (err.message)
                            return
                        }
                    else {
                        console.log('Get das Perguntas feitas com Sucesso!')
                    }
                })
            })
            return connect
        })
    }
    return {getter}
}
