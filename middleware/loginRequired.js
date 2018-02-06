module.exports = function(req, res, next){
  if(!req.session.username){
    res.redirect('/login');
  } else{
    next();
  }
}
