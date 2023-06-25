const cloudinary = require('cloudinary').v2


cloudinary.config({ 
    // llama a las varibles del archivo .ENV
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});

// EXPORTACION DEL POR DEFAULT DEL METODO uploadImage
module.exports.uploadImage = async(filePath) => {
// SUBIR LA IMAGEN DE LA RUTA(FILEPATH)
    return await cloudinary.uploader.upload(filePath,{folder:'portafolio'})
}

// esportar del por default del metodo deleteImage
module.exports.deleteImage = async (publicId)=>{
    
    return await cloudinary.uploader.destroy(publicId)
}