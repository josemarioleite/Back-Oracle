const oracledb = require('oracledb')
const dbConfig = require('../config/dbconfig')

module.exports = app => {
    const deleter = function (req, res, next) {
        oracledb.getConnection(dbConfig, function (err, conn) {
            if(err) {
                res.status(501).send(err.message)
            }
            conn.execute(`TRUNCATE TABLE your-table`, // CUIDADO: Comando SQL para deletar tudo da tabela, VERIFIQUE A TABELA ANTES DE DAR O COMANDO
            {/* Passar os parametros e receber o objeto (Não necessário no momento)*/ }, 
            function(err, result){
                if (err) {
                    next(err)
                    return
                }
            conn.release(function (err) {
                if (err) {
                    next(err)
                    return
                }
                else {
                    console.log('Deletado com Sucesso!')
                }
                    res.status(201).json(req.body)
                    res.send(JSON.stringify(result.rows))
                })
            })
        })
    }
    return {deleter}
}