// Définition des méssages d'erreurs HTTP de l'API

export enum UriginError {
    NO_USER_FOUND = 'User not found.',
    OBJECT_NOT_FOUND = 'Object not found.',
    DECRYPTION_ERROR = 'UriginError during password encryption.',
    ENCRYPTION_ERROR = 'UriginError during password decryption.',
    PASSWORD_INVALID = 'Password invalid.',
    TOKEN_INVALID = 'Failed to authenticate token.',
    FORBIDDEN = 'You don\'t have enough perogative.',
    NO_TOKEN = 'No token provided.',
    PARAMETER_MANDATORY = 'the parameter %d is mandatory',
    ERROR_WITH_DATABASE = 'error occured during databse action',
    OBJECT_ALREADY_EXIST = 'an object already exist with this parameters'
}