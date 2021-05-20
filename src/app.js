const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Defines path for express configuration
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// set handlebars engine and view location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Dhruvil Page'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Dhruvil Patel'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'Dhruvil Patel'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'you must provide a address!'
        })
    }
    
    geocode(req.query.address, (error, {latitude, longitude, location } = {}) => {
    
        if(error){
            return res.send({error})
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            
            if(error) {
                return res.send({ error })
            }
    
            console.log(location)
            console.log(forecastData)
            res.send({
                Location: req.query.address,
                forecastData
            })
        })
    
    })

    
})

// app.get('/products', (req, res) => {
//     if (!req.query.name) {
//         return res.send({
//             error: 'you must provide a search term'
//         })
//     }
    
//     console.log(req.query.name)
//     res.send({
//         product: []
//     })
    
// })

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Page',
        name: 'Dhruvil Patel',
        errorMessage: 'Help article not found!'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Page',
        name: 'Dhruvil Patel',
        errorMessage: 'Page Not Found!'
    })
})

app.listen(3000, () => {
    console.log('Server is started successful on port 3000!')
})
