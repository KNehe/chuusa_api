import multer from 'multer'
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../utils/statusCodes";
import { WRONG_IMG_MIME,ERROR_CREATING_PDF } from "../utils/errorMessages";
import path from 'path'
import AppError from "../utils/appError"
import clodinary from 'cloudinary'

const maxSize = 1 * 1000 *1000;

const rawPath = `${__dirname}./../../public/uploads`

const requiredPath = path.resolve(rawPath)

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
      cb(null, requiredPath)
    },
    filename: (req, file, cb)=>{
      cb(null, Date.now() + '_' + file.originalname)
    },
  })
  
const localUpload = multer({ storage ,
    limits: { fileSize:maxSize},
    fileFilter: (req,file,cb)=>{
        const fileTypes = /doc|docx/; 
        const mimetype = fileTypes.test(file.mimetype);
        const extName  = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());                 
       
        if (mimetype && extName) {           
            return cb(null,true); 
        }else{
            cb(new AppError(WRONG_IMG_MIME,BAD_REQUEST));                                
        }
    }
}).single('file')


const cloudinaryInstance = clodinary.v2

const uploadToCloudinary = async(pdf) =>{

  cloudinaryInstance.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

  const result = await cloudinaryInstance
    .uploader
    .upload(pdf,
      {folder:'chuusa_app_pdfs', use_filename:true },
      (error, result)=>{

      if(error) return new AppError(ERROR_CREATING_PDF, INTERNAL_SERVER_ERROR)
  })

  const {url} = result;
  return url 

}

export {localUpload, uploadToCloudinary}




