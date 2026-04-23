require('dotenv').config();
const config = require('./utils/config');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

const ClientError = require('./exceptions/ClientError');
const plugins = require('./plugins/plugins');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['https://makanyuk-frontend.vercel.app', 'http://localhost:8080'], 
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
                additionalHeaders: ['cache-control', 'x-requested-with'],
                credentials: true
            },
        },
    });

    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        }
    ]);

    server.auth.strategy('makanyuk_jwt', 'jwt', {
        keys: config.token.accessToken,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: config.token.tokenAge
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register(plugins);

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof Error) {
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (!response.isServer) {
                return h.continue;
            }

            console.error(response);

            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });
            newResponse.code(500);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server Running in ${server.info.uri}`);
};

init();