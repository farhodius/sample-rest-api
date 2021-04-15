const FileModel = require('../models/file.model');
const FileSystemDriver = require('../utils/file-system.driver');
const AppError = require('../errors/app.error');
const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const fileUploadDir = path.join(path.dirname(require.main.filename), 'uploadedFiles');
const storageDriver = new FileSystemDriver(fileUploadDir);
const fileModel = new FileModel(storageDriver);

class FileController {

  async store(req) {
    return new Promise((resolve, reject) => {
      const busboy = new Busboy({ headers: req.headers });
      busboy.on('file', (fieldname, file, filename) => {
        // require.main.filename is not reliable in some cases - like when using pm2 as process manager
        const savePath = path.join(fileUploadDir, filename);
        // Streaming file to disk - in real life files will likely go to S3 or some other cloud storage
        file.pipe(fs.createWriteStream(savePath));
      });
      busboy.on('finish', () => {
        resolve({ result: 'success' });
      });
      req.pipe(busboy);
    });
  }

  async findAll() {
    return fileModel.find({});
  }

  async getFilePath(fileName) {
    const files = await fileModel.find({});
    if(files.includes(fileName)) {
      const filePath = path.join(fileUploadDir, fileName);
      return Promise.resolve(filePath);
    }
    else {
      throw new AppError('File not found.', 404, 'F-1000');
    }
  }
}

module.exports = new FileController();