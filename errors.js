exports.handleServerErrors = (err, req, res, next) => {
    console.log('in the error')
    
    res.status(404).send({ msg: '404 Not Found' })
  
    
  }
