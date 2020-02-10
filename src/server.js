const express = require('express')
require('./db/mongoose.js')
var cors = require('cors')
const User = require('./models/user')
const auth = require('./middlewares/auth')

const app = express()
const port = process.env.PORT || 3000


app.use(cors())
app.use(express.json())                                                 //to parse incoming json to an object

//Route to signin user
app.post('/signin', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.genAuthToken()
        res.send({ user , token })
    }catch(err) {   
        res.status(400).send(`${err}`)
    }
})

//Route to increment entries count
app.post('/findface',auth , async (req, res) => {
    const user = req.user
    
    try {
        user.entries = user.entries + 1;
        await user.save()

          res.send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Route to register new user
app.post('/register', async (req, res) => {
	const user = new User(req.body)
    
    try{
        await user.save()
        const token = await user.genAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

//Route to fetch user
app.get('/users/me', auth , async (req, res) => {
    res.send(req.user)
})

//Route to logout user from current session **
app.post('/users/logout', auth , async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
            await req.user.save()
            
            res.send('Successfully logged out!!')
        
    } catch (err) {
        res.status(500).send()
    }
})

//Route to logout user form all sessions or all devices **
app.post('/users/logoutAll', auth , async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Successfully logged out of all!!')
    } catch (err) {
        res.status(500).send()
    }
})


app.listen(port, () => console.log(`Server is up at port ${port}!`))