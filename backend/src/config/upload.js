import path from 'path';
import multer from 'multer';
import MulterSharpResizer from 'multer-sharp-resizer';

const publicFolder = path.resolve(__dirname, '..', '..', 'public');
const publicFolderProductPoint = path.resolve(__dirname, '..', '..', 'public', 'product-point');

const uploadCfg = {
  directory: publicFolder,

  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'product_point_img') {
        cb(null, publicFolderProductPoint);
      } else {
        cb(null, publicFolder);
      }
    },
    filename(req, file, cb) {
      let namaFile;
      if (file.fieldname === 'product_point_img') {
        namaFile = 'point-' + new Date().getTime() + path.extname(file.originalname);
      } else {
        namaFile = 'img-' + new Date().getTime() + path.extname(file.originalname);
      }

      return cb(null, namaFile);
    }
  })
};

const upload = multer(uploadCfg);

export { upload };
