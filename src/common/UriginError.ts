export enum UriginError {
    NO_USER_FOUND = 'User not found.',
    DECRYPTION_ERROR = 'UriginError during password encryption.',
    ENCRYPTION_ERROR = 'UriginError during password decryption.',
    PASSWORD_INVALID = 'Password invalid.',
    TOKEN_INVALID = 'Failed to authenticate token.',
    FORBIDDEN = 'You don\'t have enough perogative.',
    NO_TOKEN = 'No token provided.',
    PARAMETER_MANDATORY = 'the parameter %d is mandatory'
}