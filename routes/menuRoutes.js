const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
router.get('/', menuController.showMenu);
router.get('/menu-async', menuController.menuAsync);
router.get('/menu-callback', menuController.menuCallback);
router.get('/menu-promise', menuController.menuPromise);
router.get('/menu-sync', menuController.menuSync);
router.get('/order', menuController.showOrderForm);
router.post('/order', menuController.submitOrder);
router.get('/admin/login', function(req, res){
  res.render('adminLogin', { error: null });
});
router.post('/admin/login', function(req, res){
  const { password } = req.body;
  if (password === 'password') {
    res.redirect('/admin');
  } else {
    res.render('adminLogin', { error: 'Try again' });
  }
});
router.get('/admin', menuController.adminPanel);
router.get('/admin/menu', menuController.adminMenu);
router.post('/admin/menu/add', menuController.addMenuItem);
router.post('/admin/menu/delete', menuController.deleteMenuItem);
router.get('/admin/orders', menuController.viewOrders);
router.post('/admin/orders/delete/:id', menuController.deleteOrder);
module.exports = router;
