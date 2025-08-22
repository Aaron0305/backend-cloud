import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import https from 'https';

export const streamFile = async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).send('URL no proporcionada');
        }

        // Hacer una solicitud GET al archivo en Cloudinary
        https.get(url, (response) => {
            // Configurar headers para forzar la visualización en el navegador
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="documento.pdf"');
            
            // Transmitir el archivo directamente al cliente
            response.pipe(res);
        }).on('error', (err) => {
            console.error('Error al obtener el archivo:', err);
            res.status(500).send('Error al obtener el archivo');
        });
    } catch (error) {
        console.error('Error en streamFile:', error);
        res.status(500).send('Error interno del servidor');
    }
};
