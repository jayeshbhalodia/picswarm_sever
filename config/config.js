let tmpConfig = {
    mongoDBURI: 'mongodb://localhost/picswarm_local',
};

if (process.env.NODE_ENV === 'production') {
    tmpConfig = {
        mongoDBURI: 'mongodb://picswarm_prod_user:Mm4s1oTO60dD1ewofd34@mongo-dedicated-private.drawpoint.biz/picswarm_prod',
    };
}

if (process.env.NODE_ENV === 'staging') {
    tmpConfig = {
        mongoDBURI: 'mongodb://picswarm_staging_user:K4s1oTO60dD12ms6V@mongo-dedicated-private.drawpoint.biz/picswarm_staging',
    };
}

exports.config = tmpConfig; 