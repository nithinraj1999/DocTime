import multer, { FileFilterCallback } from 'multer';



export const upload = multer({
  storage: multer.memoryStorage(), 
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
    fieldSize: 100 * 1024 * 1024, // 100 MB
    fields: 50, 
    files: 1, 
  },
  fileFilter: (req, file, cb: FileFilterCallback) => {
   
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/zip'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); 
    } else {
      cb(new Error('Only images, PDFs, and ZIP files are allowed') as any, false); // Reject non-allowed files
    }

  },
});



