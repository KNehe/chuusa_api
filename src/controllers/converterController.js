import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR } from "../utils/statusCodes";
import { LIMIT_FILE_SIZE, SUCCESS_MSG } from "../utils/statusMessages";
import AppError from "../utils/appError";
import { FILE_UPLOAD_ERROR, LIMIT_FILE_SIZE_ERROR,
    NO_DOCUMENT_PROVIDED,WRONG_IMG_MIME,
    ERROR_CREATING_PDF,
   } from "../utils/errorMessages";
import {localUpload} from '../services/uploadService'
import docxConverter from 'docx-pdf'
import path from 'path'
import pdf2base64 from 'pdf-to-base64'

const wordToPDF = async (req,res,next) =>{
    try{                              
        localUpload(req,res,err =>{
                
                const file = res?.req?.file
                const fileName = file?.filename
                 
                if(!fileName) return next(new AppError(NO_DOCUMENT_PROVIDED,BAD_REQUEST))

                if(err) return uploaderError(err,next)

                const rawPath = `${__dirname}./../../public/pdfs`

                const requiredPath = path.resolve(rawPath)

                const newFileName =  `${requiredPath}/` +file?.originalname.substr(0, file?.originalname.lastIndexOf(".")) + ".pdf"
            
                docxConverter(`${file?.path}`,`${newFileName}`,async (err,result) =>{
                    if(err){
                      console.log("docconverter err",err);
                      return next( new AppError(ERROR_CREATING_PDF,INTERNAL_SERVER_ERROR))
                    }

                    const base64File = await pdf2base64(result.filename)

                    res.status(CREATED).json({
                        status: SUCCESS_MSG,
                        data:{                          
                             base64File
                        }
                    });

                  });
             })             
        
    }catch(e){
        console.log(e.message);
        return next( new AppError(ERROR_CREATING_PDF,INTERNAL_SERVER_ERROR));
    }
}

const uploaderError = (err,next) =>{
    console.log(err)

    if(err.code == LIMIT_FILE_SIZE) return next(new AppError(LIMIT_FILE_SIZE_ERROR,BAD_REQUEST));
                
    if(err.message == WRONG_IMG_MIME) return next(new AppError(WRONG_IMG_MIME,BAD_REQUEST));
                
    return next(new AppError(FILE_UPLOAD_ERROR,BAD_REQUEST));
}

export {wordToPDF}