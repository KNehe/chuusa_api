import express from 'express'
import cors from 'cors'
import convertRoutes from './src/routes/convert'
import { globalErrorHandler } from './src/controllers/errorController'
import AppError from './src/utils/appError'
import {NOT_FOUND, SUCCESS } from './src/utils/statusCodes'
import dotenv from 'dotenv'
import { SUCCESS_MSG } from './src/utils/statusMessages'

dotenv.config()

const app = express()

app.use(express.json())

app.use(cors())

app.use("/api/v1/convert", convertRoutes)

app.get("/",(req,res,next)=>{
    res.status(SUCCESS).json({
        status:SUCCESS_MSG,
        message: 'Welcome to chuusa api'
    })
})

app.all("*",(req,res,next)=>{
    next( new AppError(`Can't find ${req.originalUrl} on this server`,NOT_FOUND))
})

app.use(globalErrorHandler)

export default app

