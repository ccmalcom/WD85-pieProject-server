const router = require('express').Router();
const { UserModel } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');

let bOne = bcrypt.hashSync('password123', 13);
let bTwo = bcrypt.hashSync('abc123', 13);
console.log('B-ONE: ', bOne);
console.log('B-TWO: ', bTwo);
console.log('One to Two SAME?: ', bcrypt.compareSync(bOne, bTwo));
console.log('One to String SAME?: ', bcrypt.compareSync('abc123', bTwo));

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password
    } = req.body;

    try {
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, 13)
        })
        const token = jwt.sign(
            { id: newUser.id, },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 * 12 }
        )

        res.status(201).json({
            msg: 'User Registered!',
            user: newUser,
            token
        })
    } catch (err) {
        if(err instanceof UniqueConstraintError){
            res.status(409).json({
                msg: `Email already in use.`
            });
        } else {
            res.status(500).json({
                error: `Failed to register user: ${err}`
            })
        }
    }
});

router.post('/login', async (req, res)=>{
    let { email, password } = req.body; //means req.body.email, req.body.password ...

    // let email = req.body.email
    // let password = req.body.password

    try {
        let loginUser = await UserModel.findOne({
            where: {email: email,}
        })

        if(loginUser){ //does this user exist (boolean)
            let passwordComparison = await bcrypt.compare(password, loginUser.password); //compare entered password to db password

            if(passwordComparison){ //does this password match (boolean)
                let token = jwt.sign(
                    {id: loginUser.id},
                    process.env.JWT_SECRET,
                    {expiresIn: 60 * 60 * 24}
                );

                res.status(200).json({
                    user: loginUser,
                    msg: 'User successfully logged in!',
                    token
                });

            } else {
                res.status(401).json({
                    msg: `Incorrect email or password`
                })
            }
            
        } else {
            res.status(401).json({
                msg: `Incorrect email or password`
            })

        }
    } catch (err) {
        res.status(500).json({
            msg: `Error logging in! This is likely a server error, try again in a few minutes.`
        })
    }
});
// router.get('/', async (req, res)=>{
//     try{
//         const
//     } catch (err){

//     }
// })

module.exports = router;