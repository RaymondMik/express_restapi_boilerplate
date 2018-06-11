const {ObjectID} = require('mongodb');

module.exports.validateId = (id, resStatus) => {
    if (!ObjectID.isValid(id)) {
        return res.status(resStatus).send(`The ID: ${id} is not valid`);
    }
};