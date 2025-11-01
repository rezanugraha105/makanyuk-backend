const autoBind = require('auto-bind');

class AuthenticationHandler {
    constructor(authenticationService, usersService, tokenManager, validator) {
        this._authenticationService = authenticationService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        autoBind(this);
    }

    async postAuthenticationHandler(request, h) {
        this._validator.validatePostAuthenticationPayload(request.payload);

        const { username, password } = request.payload;
        const id = await this._usersService.verifyUserCredentials(username, password);

        const accessToken = this._tokenManager.generateAccessToken({ id });
        const refreshToken = this._tokenManager.generateRefreshToken({ id });

        await this._authenticationService.addRefreshToken(refreshToken);

        const response = h.response({
            status: 'success',
            message: 'Login berhasil!.',
            data: {
                accessToken,
                refreshToken,
            },
        });
        response.code(200);
        return response;
    }

    async putAuthenticationHandler(request, h) {
        this._validator.validatePutAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;
        await this._authenticationService.verifyRefreshToken(refreshToken);
        const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({ id });
        return h.response({
            status: 'success',
            message: 'Refresh Token berhasil diperbarui.',
            data: {
                accessToken,
            },
        });
    }

    async deleteAuthenticationHandler(request, h) {
        this._validator.validateDeleteAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;
        await this._authenticationService.verifyRefreshToken(refreshToken);
        await this._authenticationService.deleteRefreshToken(refreshToken);

        return h.response({
            status: 'success',
            message: 'Refresh Token berhasil dihapus.',
        });
    }
}

module.exports = AuthenticationHandler;