const oracledb = require('oracledb')
const dbConfig = require('../config/dbconfig')

module.exports = app => {
    const getResp = function (req, res, next){
        const resps = `SELECT * FROM your-table-answers`
        const connect = oracledb.getConnection(dbConfig, function(getError, conn) {
            if (getError) {
                next(getError.message)
                    return
            }
            conn.execute(
                resps, 
                {
                    // Passar aqui os Parâmetros da requisição (No momento não é necessário)
                }, 
                {
                    autoCommit: true,
                    outFormat: oracledb.OBJECT
                },
            function(err, result) {
                if(err) {
                    next(err.message)
                     return
                }
                else {
                    res.contentType('application/json').status(200)                            
                    res.send(JSON.stringify(result.rows))
                }
                conn.release(function (error) {
                    if(error) {
                        next(error)
                        return
                    }
                    else {
                        console.log('Respostas Obtidas com Sucesso!')
                    }
                })
            })
            return connect
        })
    }
    return {getResp}
}