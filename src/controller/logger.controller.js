import logger from "../logger.js"

export const loggerTest = async (req, res) => {
        logger.debug('Esto es un mensaje de depuración.');
        logger.http('Esto es un mensaje HTTP.');
        logger.info('Esto es un mensaje informativo.');
        logger.warning('Esto es una advertencia.');
        logger.error('Esto es un mensaje de error.');
        logger.fatal('Esto es un mensaje fatal.');

        res.send('Prueba de logs realizada.');
}