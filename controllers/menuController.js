const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const files = {
  async: path.join(__dirname, '../data/menu-async.json'),
  callback: path.join(__dirname, '../data/menu-callback.json'),
  promise: path.join(__dirname, '../data/menu-promise.json'),
  sync: path.join(__dirname, '../data/menu-sync.json'),
  orders: path.join(__dirname, '../data/orders.json')
};
exports.getMenuAsync = async function(){
  const data = await fsPromises.readFile(files.async, 'utf-8');
  return JSON.parse(data);
};
exports.getMenuCallbackAsync = function(){
  return new Promise( function(resolve, reject){
    fs.readFile(files.callback, 'utf-8', function(err, data){
      if (err){
        reject(err);
      }
      else{
        resolve(JSON.parse(data));
      }
    });
  });
};
exports.getMenuPromise = function(){
  return fsPromises.readFile(files.promise, 'utf-8').then(data => JSON.parse(data));
};
exports.getMenuSync = function(){
  const data = fs.readFileSync(files.sync, 'utf-8');
  return JSON.parse(data);
};
function readOrders() {
  return JSON.parse(fs.readFileSync(files.orders, 'utf-8'));
}
function writeOrders(orders) {
  fs.writeFileSync(files.orders, JSON.stringify(orders, null, 2));
}
exports.showMenu = async function(req, res){
  const type = req.query.type || 'async';
  let menu;
  const loaderMap = {
    callback: exports.getMenuCallbackAsync,
    promise: exports.getMenuPromise,
    sync: exports.getMenuSync,
    async: exports.getMenuAsync,
  };
  const loader = loaderMap[type] || exports.getMenuAsync;
  menu = await loader();
  res.render('menu', { menu, type });
};
exports.menuAsync = async function(req, res){
  const menu = await exports.getMenuAsync();
  res.render('menu', { menu, type: 'async' });
};
exports.menuCallback = async function(req, res){
  const menu = await exports.getMenuCallbackAsync();
  res.render('menu', { menu, type: 'callback' });
};
exports.menuPromise = async function(req, res){
  const menu = await exports.getMenuPromise();
  res.render('menu', { menu, type: 'promise' });
};
exports.menuSync = function(req, res){
  const menu = exports.getMenuSync();
  res.render('menu', { menu, type: 'sync' });
};
exports.showOrderForm = async function(req, res){
  const type = req.query.type || 'async';
  let menu;
  switch(type) {
    case 'callback':
      menu = await exports.getMenuCallbackAsync();
      break;
    case 'promise':
      menu = await exports.getMenuPromise();
      break;
    case 'sync':
      menu = exports.getMenuSync();
      break;
    case 'async':
    default:
      menu = await exports.getMenuAsync();
  }
  res.render('order', { menu, type });
};
exports.submitOrder = function(req, res){
  const { name, items } = req.body;
  let selectedItems = [];
  if (Array.isArray(items)) {
    selectedItems = items;
  } else {
    selectedItems = [items];
  }
  const orders = readOrders();
  orders.push({
    id: uuidv4(),
    name,
    items: selectedItems
  });
  writeOrders(orders);
  res.redirect('/');
};
exports.adminPanel = function(req, res){
  res.render('admin');
};
exports.viewOrders = function(req, res){
  const orders = readOrders();
  res.render('adminOrders', { orders });
};
exports.deleteOrder = function(req, res){
  const id = req.params.id;
  let orders = readOrders();
  orders = orders.filter(order => order.id !== id);
  writeOrders(orders);
  res.redirect('/admin/orders');
};
function readMenuFile(type) {
  try {
    switch(type) {
      case 'callback':
        return JSON.parse(fs.readFileSync(files.callback, 'utf-8'));
      case 'promise':
        return JSON.parse(fs.readFileSync(files.promise, 'utf-8'));
      case 'sync':
        return JSON.parse(fs.readFileSync(files.sync, 'utf-8'));
      case 'async':
      default:
        return JSON.parse(fs.readFileSync(files.async, 'utf-8'));
    }
  } catch {
    return [];
  }
}
function writeMenuFile(type, data) {
  switch(type) {
    case 'callback':
      fs.writeFileSync(files.callback, JSON.stringify(data, null, 2));
      break;
    case 'promise':
      fs.writeFileSync(files.promise, JSON.stringify(data, null, 2));
      break;
    case 'sync':
      fs.writeFileSync(files.sync, JSON.stringify(data, null, 2));
      break;
    case 'async':
    default:
      fs.writeFileSync(files.async, JSON.stringify(data, null, 2));
  }
}
exports.adminMenu = function(req, res){
  const type = req.query.type || 'async';
  const menu = readMenuFile(type);
  res.render('adminMenu', { menu, type });
};
exports.addMenuItem = function(req, res){
  const { type, name, price } = req.body;
  const menu = readMenuFile(type);
  menu.push({ name, price: Number(price) });
  writeMenuFile(type, menu);
  res.redirect(`/admin/menu?type=${type}`);
};
exports.deleteMenuItem = function(req, res){
  const { type, name } = req.body;
  let menu = readMenuFile(type);
  menu = menu.filter(item => item.name !== name);
  writeMenuFile(type, menu);
  res.redirect(`/admin/menu?type=${type}`);
};
