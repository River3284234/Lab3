const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const files = {
  async: path.join(__dirname, '../data/menu-async.json'),
  callback: path.join(__dirname, '../data/menu-callback.json'),
  promise: path.join(__dirname, '../data/menu-promise.json'),
  sync: path.join(__dirname, '../data/menu-sync.json')
};
exports.getMenuAsync = async function(){
  const data = await fsPromises.readFile(files.async, 'utf-8');
  return JSON.parse(data);
};
exports.getMenuCallbackAsync = function(){
  return new Promise( function(resolve, reject){
    fs.readFile(files.callback, 'utf-8', function(err, data){
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};
exports.getMenuPromise = function(){
  return fsPromises.readFile(files.promise, 'utf-8')
    .then(data => JSON.parse(data));
};
exports.getMenuSync = function(){
  const data = fs.readFileSync(files.sync, 'utf-8');
  return JSON.parse(data);
};
