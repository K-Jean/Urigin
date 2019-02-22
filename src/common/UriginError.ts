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
    PARAMETER_VALIDATION_ERROR = 'Your parameter don\'t respect the documentation',
    PARAMETER_MANDATORY = 'The parameter %d is mandatory',
    ERROR_WITH_DATABASE = 'Error occured during databse action',
    OBJECT_ALREADY_EXIST = 'An object already exist with this parameters'
}