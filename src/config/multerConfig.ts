import multer from 'multer';
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
     
        if (file.mimetype.startsWith('image/')) {
          
            cb(null, true);
        } else {

            cb(new Error('Solo se permiten archivos de imagen.'));
        }
    },
});

export default upload;
