function protect(req, res, next) {
    if (!req.session) {
        return res.status(500).json({
            success: false,
            error: 'Session non initialisée'
        });
    }

    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            error: 'Non authentifié'
        });
    }

    req.user = req.session.user;
    return next();
}

module.exports = protect;