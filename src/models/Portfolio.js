const { Schema, model } = require('mongoose')


const portfolioSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    // sudocumento, se esta haciendo una relacion un usario tiene portafolios y muchos portafolios un usuario
    user: {
        type: String,
        required: true
    },
    image: {
        public_id: String,
        secure_url: String
    }

}, {
    timestamps: true
})

module.exports = model('portfolio', portfolioSchema)