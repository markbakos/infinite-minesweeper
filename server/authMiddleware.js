const jwt = require('jsonwebtoken');

const authenticateToken = (req,res,next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token) {
        return res.status(401).json({message: 'Access Denied: No Token Provided'});
    }

    try{
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (e) {
        res.status(403).json( { message: 'Invalid Token' });
    }
};

module.exports = authenticateToken;