const jwt = require('jsonwebtoken');
const { UserModel } = require('../models');

const validateSession = async(req, res, next) =>{
    if(req.method === 'OPTIONS'){
        return next()
    } else if (req.headers.authorization){ 
        const {authorization} = req.headers;
        const payload = authorization ? jwt.verify(authorization, process.env.JWT_SECRET) : undefined

        if(payload) { //if it passed the above function
            let foundUser = await UserModel.findOne({ //do we have a user with this ID
                where: {id: payload.id}
            });

            if (foundUser) {
                req.user = foundUser;
                next() //if user is found, move on
            } else {
                res.status(400).send({
                    msg: `Not Authorized`
                })
            }

        } else {
            res.status(401).send({
                msg: `Invalid Token. Are you logged in?`
            })
        }
    } else {
        res.status(403).send({
            msg: `Forbidden.`
        })
    }
}

module.exports = validateSession;