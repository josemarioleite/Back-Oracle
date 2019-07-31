const oracledb = require('oracledb')
const dbConfig = require('../config/dbconfig')

module.exports = app => {
    const postter = function (req, res, next) {
        var todo = req.body
        var insertStmt = '' +
            'insert into your-table-asnwer ( ' +
            '  RESPOSTA, ' +
            '  CODSETOR, ' +
            '  CODFILIAL, ' +
            '  NUMSEQ, ' +
            '  CODIGO ' +

            ') values ( ' +
            
            '  :RESPOSTA, ' +
            '  :CODSETOR, ' +
            '  :CODFILIAL, ' +
            '  :NUMSEQ, ' +
            '  :CODIGO ' +
            ')'

        const connect = oracledb.getConnection(dbConfig, function (getConnErr, conn) {

            if (getConnErr) {
                next(getConnErr)
                return
            }

            conn.execute(
                insertStmt, {
                    RESPOSTA: todo.RESPOSTA,
                    CODSETOR: todo.CODSETOR,
                    CODFILIAL: todo.CODFILIAL,
                    NUMSEQ: todo.NUMSEQ,
                    CODIGO: todo.CODIGO
                },
                {
                    autoCommit: true
                },
                function (executeErr, result) {
                    if (executeErr) {
                        next(executeErr)
                        return
                    }
                    conn.release(function (releaseErr) {
                        if (releaseErr) {
                            next(releaseErr)
                            return
                        }
                        else {
                            console.log('Enviado com Sucesso!')
                        }
                        res.status(201).json(todo)
                        res.send(JSON.stringify(result.rows))
                    })
                })
        })
        return connect
    }
    return {postter}
}

