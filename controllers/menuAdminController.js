const fs = require('fs');
const path = require('path');
const files = {
  async: path.join(__dirname, '../data/menu-async.json'),
  callback: path.join(__dirname, '../data/menu-callback.json'),
  promise: path.join(__dirname, '../data/menu-promise.json'),
  sync: path.join(__dirname, '../data/menu-sync.json')
};
function readMenu(type) {
  const filePath = files[type];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}
function writeMenu(type, menu) {
  const filePath = files[type];
  fs.writeFileSync(filePath, JSON.stringify(menu, null, 2));
}
exports.showAdminMenu = function(req, res){
  const type = req.query.type || 'async';
  const menu = readMenu(type);
  res.render('adminMenu', { menu, type });
};
exports.addMenuItem = function(req, res){
  const { name, price, type } = req.body;
  const menu = readMenu(type);
  menu.push({ name, price: Number(price) });
  writeMenu(type, menu);
  res.redirect(`/admin/menu?type=${type}`);
};
exports.deleteMenuItem = function(req, res){
  const { name, type } = req.body;
  let menu = readMenu(type);
  menu = menu.filter(item => item.name !== name);
  writeMenu(type, menu);
  res.redirect(`/admin/menu?type=${type}`);
};
