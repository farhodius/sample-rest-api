const FileModel = require('../models/file.model');
const FileSystemDriver = require('../utils/file-system.driver');
const AppError = require('../errors/app.error');
const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
// require.main.filename is not reliable in some cases - like when using pm2 as process manager
const fileUploadDir = path.join(path.dirname(require.main.filename), 'uploadedFiles');
const storageDriver = new FileSystemDriver(fileUploadDir);
const fileModel = new FileModel(storageDriver);
const allowedFileTypes = ['application/gzip', 'application/x-gzip', 'application/x-compressed'];
const allowedFileExtension = ['.tgz', '.tar.gz'];

class FileController {

  async store(req) {
    return new Promise((resolve, reject) => {
      const busboy = new Busboy({ headers: req.headers });
      busboy.on('file', async (fieldname, file, filename, enc, mimeType) => {
        // Validate file type
        if (!allowedFileTypes.includes(mimeType)) {
          reject(new AppError('Invalid file type.', 400, 'P-1050'));
          return;
        }

        // Escape all chars except for alpha-numerics underscores and periods
        const safeFileName = filename.replace(/[^A-Za-z0-9_\.]+/g, '_');
        const availableFileName = await this.getAvailableFileName(safeFileName, 0);
        const savePath = path.join(fileUploadDir, availableFileName);

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
    if (files.includes(fileName)) {
      const filePath = path.join(fileUploadDir, fileName);
      return Promise.resolve(filePath);
    }
    else {
      throw new AppError('File not found.', 404, 'F-1000');
    }
  }
  
  /**
   * This is not the most efficient solution if we have a lot of files given the storage solution is local file system.
   * In real world app files will likely be stored in cloud starages like S3 and the app will have DB entries associated with the files.
   * In this case this logic will look different.
   */
  async getAvailableFileName(fileName, fileCount) {
    const file = this.incrementFileName(fileName, fileCount);
    try {
      const filePath = await this.getFilePath(file);
    } catch (error) {
      return Promise.resolve(file);
    }
    return await this.getAvailableFileName(fileName, ++fileCount);
  }

  incrementFileName(fileName, count) {
    if(count === 0) {
      return fileName;
    }
    // Find allowed file extension, this allows to account for special usecases like '.tar.gz' extensions
    let fileExtension = '';
    allowedFileExtension.some((ext) => {
      if (fileName.endsWith(ext)){
        fileExtension = ext;
        return true;
      }
    });
    // If file extension was not found just set to period;
    if(!fileExtension) {
      fileExtension = '.';
    }
    const index = fileName.lastIndexOf(fileExtension);
    const name = `${fileName.slice(0, index)}(${count})${fileName.slice(index)}`;
    return name;
  }
  
}

module.exports = new FileController();