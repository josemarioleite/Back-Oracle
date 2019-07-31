const { authSecret } = require('../.env')
const passport = require('passport')
const oracledb = require('oracledb')
const dbConfig = require('../config/dbconfig')
const passJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passJwt

module.exports = app => {
    const sqlComm = ' select IDUSER, ' + 
                    ' FROM 'YOUR TABLE' ' + 
                    ' WHERE IDUSER = :IDUSER'
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }
    
    oracledb.getConnection(dbConfig, function (err, conn) {
        if (err) {
            console.log(err.message)
            return
        }
        const strategy = new Strategy(params, (payload, done) => {
            conn.execute(
                sqlComm, 
                {
                    IDUSER: payload.IDUSER
                },
                {
                    autoCommit: true,
                    outFormat: oracledb.OBJECT            
                })
                .then(user => {
                    if (user) {
                        done(null, 
                        { 
                            IDUSER: user.IDUSER, 
                            NAMEUSER: user.NAMEUSER
                        })
                    }
                    else {
                        done(null, false)
                    }
                })
                .catch(err => done(err, false))
        })
        passport.use(strategy)
    })

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}