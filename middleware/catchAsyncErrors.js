// module.exports=func =>(req,res,next)=>
// Promise.resolve(func(req,res,next))
// .catch(next)
module.exports = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };
  