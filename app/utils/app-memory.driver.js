// This is an immitation of a storage solution
// This is a bad option because it won't work properly in a cluster of app servers/containers
class AppMemoryDriver {
  constructor() {
    this.collection = [];
    this.idCount = 1;
    this.PK = '_id';
  }

  add(item) {
    return new Promise((resolve, reject) => {
      item[this.PK] = parseInt(this.idCount);
      this.collection.push(item);
      this.idCount++;
      resolve(item);
    });
  }

  update(item, filters) {
    return new Promise((resolve, reject) => {
      const filterKeys = Object.keys(filters);
      const itemKeys = Object.keys(item);
      // Remove primary key from the list - we don't want to udpate it exidentally
      const updateKeys = itemKeys.filter((key) => key !== this.PK);

      // If no fields to update just stop here
      if (updateKeys.length === 0) {
        return resolve(true);
      }

      this.collection.forEach((row) => {
        let match = false;
        // Validate the match if filters specified
        if (filterKeys.length > 0) {
          match = filterKeys.every((key) => {
            return filters[key] === row[key];
          });
        }
        else {
          // If no filters - update all the items in the collection
          match = true;
        }

        if (match) {
          updateKeys.forEach((key) => {
            row[key] = item[key];
          });
        }

      });

      resolve(true);
    });
  }

  delete(filters) {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(filters);
      if(keys.length === 0) {
        // We don't want to delete entire collection if no filters specified
        resolve(true);
      }
      
      this.collection = this.collection.filter((item) => {
        const match = keys.every((key) => {
          return filters[key] === item[key];
        });
        return !match;
      });
      resolve(true);
    });
  }

  find(filters) {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(filters);
      // This is not very efficient search mechanism but for the purpose of this project should be fine
      const item = this.collection.find((item) => {
        const match = keys.every((key) => {
          return filters[key] === item[key];
        });
        return match;
      });

      resolve(item);
    });
  }

  search(filters, offset, limit) {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(filters);
      let results = [];
      const endIndex = offset + limit;

      if (keys.length > 0) {
        const items = this.collection.filter((item) => {
          const match = keys.every((key) => {
            return filters[key].toLowerCase().includes(item[key].toLowerCase()) || item[key].toLowerCase().includes(filters[key].toLowerCase());
          });
          return match;
        });
        results = items.slice(offset, endIndex)
      }
      else {
        results = this.collection.slice(offset, endIndex);
      }

      resolve(results);
    });
  }

}

module.exports = AppMemoryDriver;