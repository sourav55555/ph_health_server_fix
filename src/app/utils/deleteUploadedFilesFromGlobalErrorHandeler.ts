import {Request} from 'express'
import { deleteFileFromCloudinary } from '../../config/cloudinary.config'


export const deleteFileFromGlobalErrorHandler = async (req: Request) => {
    try {
        const filesToDelete: string[] = []
        
        if (req.file && req.file.path) {
            filesToDelete.push(req.file.path)
        } else if(req.files && typeof req.files === 'object' && !Array.isArray(req.files)){
            Object.values(req.files).forEach(fileArr => {
                if (Array.isArray(fileArr)) {
                    fileArr.forEach(fileVal => {
                        if (fileVal.path) {
                            filesToDelete.push(fileVal.path)
                        }
                    })
                }
            })
        } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            req.files.forEach(file => {
                if (file.path) {
                    filesToDelete.push(file.path)
                }
            })
        }

        if (filesToDelete.length > 0) {
            await Promise.all(
                filesToDelete.map(url => deleteFileFromCloudinary(url))
            )
            console.log(`all files deleted from cloudinary from global error ${filesToDelete.join(", ")}`)
        }


    } catch (err: any) {
        console.log("error deleting uploaded file from global error handler", err)
    }
} 