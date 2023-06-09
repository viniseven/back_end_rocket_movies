require('dotenv/config')
require('express-async-errors')

const migrationRun = require('./database/sqlite/migrations')
const AppError = require('./utils/AppError')

const cors = require("cors")
const express = require('express')
const routes = require('./routes')
const uploadConfig = require('./configs/upload')

migrationRun();

const app = express()

app.use(cors())
app.use(express.json())

app.use(routes)
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))



app.use((error, request, response, next) => {
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        })
    }
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})

const port = process.env.PORT || 3333;
app.listen(port, () => {
    console.log(`${port} in use`)
})