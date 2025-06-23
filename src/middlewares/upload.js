import fs from "fs";
import multer from "multer";
import path from "path";

const maxSize = 25 * 1024 * 1024; // 25MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use process.cwd() instead of __dirname
    const uploadPath = path.join(process.cwd(), "public", "upload");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const name = file.originalname.toLowerCase().replace(/ /g, "-");
    const finalName = `${uniqueSuffix}-${name}`;
    
    cb(null, finalName);
  },
});

// File filter for validation (optional)
const fileFilter = (req, file, cb) => {
  // Allow all file types, or add specific validation
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: maxSize },
  fileFilter: fileFilter
});

// Export using ES6 syntax
export { upload };
export default upload;