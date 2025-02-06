module.exports = {

    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404
    },

    ERROR_MESSAGES: {
        INVALID_TOKEN: 'Token inválido o expirado',
        UNAUTHORIZED_EMAIL: 'Solo se permiten correos de @horusautomation.com',
        PRODUCT_NOT_FOUND: 'Producto no encontrado'
    },

    DB_CONFIG: {
        COLLECTION_NAMES: {
            PRODUCTS: 'products',
            USERS: 'users'
        }
    },

    // Dominios permitidos
    ALLOWED_DOMAINS: ['@horusautomation.com'],

    UPLOAD: {
        MAX_FILE_SIZE: 10485760, // 10MB en bytes
        ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/gif'],
        CLOUDINARY_FOLDER: 'products'
    }
}; 