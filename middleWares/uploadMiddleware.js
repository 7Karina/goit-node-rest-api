import { nanoid } from 'nanoid';
import multer from 'multer';
import path from 'path';

export const tempDirectory = path.join(process.cwd(), 'temp');
const storage = multer.diskStorage({
  destination: tempDirectory,
  filename(req, file, cb) {
    const userId = req.user._id;
    const extname = path.extname(file.originalname);
    const fileName = `${userId}-${nanoid()}${extname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

export default upload;
