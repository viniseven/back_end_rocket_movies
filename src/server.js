require('express-async-errors')

const migrationRun = require('./database/sqlite/migrations')
const AppError = require('./utils/AppError')
const express = require('express')
const routes = require('./routes')
const uploadConfig = require('./configs/upload')

migrationRun();

const app = express()

app.use(express.json())

app.use(routes)

const port = 3334

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



app.listen(port, () => {
    console.log(`${port} in use`)
})