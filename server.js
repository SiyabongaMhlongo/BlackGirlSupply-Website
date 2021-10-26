if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({path:".env"})
}

const yocoPublicKey = process.env.YOCO_PUBLIC_KEY
const yocoSecretKey = process.env.YOCO_SECRET_KEY

console.log(yocoPublicKey, yocoSecretKey)


const express = require('express')
const app = express()
const axios = require('axios')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))


app.get('/', function(req, res){
    res.render('index.ejs',{
        yocoPublicKey: yocoPublicKey
    })
})

app.get('/makeup', function(req, res){
    res.render('makeup' , {
        yocoPublicKey: yocoPublicKey
    })
})

app.get('/skincare', function(req, res){
    res.render('skincare', {
        yocoPublicKey: yocoPublicKey
    })
})

app.get('/haircare', function(req, res){
    res.render('haircare', {
        yocoPublicKey: yocoPublicKey
    })
})

app.get('/wellness', function(req, res){
    res.render('wellness', {
        yocoPublicKey: yocoPublicKey
    })
})

app.get('/shop', function(req, res){
    res.render('shop', {
        yocoPublicKey: yocoPublicKey
    })
})

app.post('/pay', (req, res)=> {
    axios.post('https://online.yoco.com/v1/charges/', {
        token: req.body.token,
        currency: 'ZAR',
        amountInCents: price
    }, {
        headers: {
            yocoSecretKey: yocoSecretKey
        }
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.send(error.response.data);
    })
    
})



app.listen(process.env.PORT || 3000)
