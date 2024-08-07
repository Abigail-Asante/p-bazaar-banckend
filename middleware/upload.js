import { multerSaveFilesOrg } from "multer-savefilesorg";
import multer from "multer";

export const remoteUpload = multer({
    Storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILEORG_API_KEY,
        relativePath: 'p-bazaar/*'
    })
});