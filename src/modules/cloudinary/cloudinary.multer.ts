import { diskStorage } from 'multer';

export const multerConfig = {
  storage: diskStorage({}), // Not used (we upload buffers directly)
};

export const multerOptions = {
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
};
