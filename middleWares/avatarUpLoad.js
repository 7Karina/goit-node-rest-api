import multer from 'multer';
import path from 'path';

export const tempDirectory = path.join(process.cwd(), 'temp');
const storage = multer.diskStorage({
  destination: tempDirectory,
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
