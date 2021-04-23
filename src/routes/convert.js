import express from 'express'
import {wordToPDF} from '../controllers/converterController'

const router = express.Router()

router.post('/',  wordToPDF );

export default router