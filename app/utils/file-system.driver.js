// This is an immitation of a storage solution
// This is a bad option because it won't work properly in a cluster of app servers/containers
const fs = require('fs');

class FileSystemDriver {
  constructor(path) {
    this.storagePath = path;
  }

  find(filters) {
    return new Promise(async (resolve, reject) => {
      const files = await fs.promises.readdir(this.storagePath);
      resolve(files);
    });
  }


}

module.exports = FileSystemDriver;