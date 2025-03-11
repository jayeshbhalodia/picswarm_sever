module.exports = function(req, res, next) {
    // Check if user is authenticated via session
    if (!req.session.userId) {
        return res.status(401).json({ msg: 'Not authenticated' });
    }
    
    // Add user id to request object
    req.user = {
        id: req.session.userId
    };
    
    next();
}; 