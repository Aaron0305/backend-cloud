import { v2 as cloudinary } from 'cloudinary';

// Configuración básica de Cloudinary
cloudinary.config({
    cloud_name: 'dzrstenqb',
    api_key: '398629673296979',
    api_secret: 'Nq6PFaae1I72AmaZzCUbE2dPdjo',
    secure: true,
    timeout: 300000, // 5 minutos de timeout
    upload_timeout: 300000 // 5 minutos de timeout para subidas
});

// Configurar acceso público para recursos raw
const configureCloudinary = async () => {
    try {
        // Crear la carpeta si no existe
        await cloudinary.api.create_folder('evidencias').catch(() => {});
        
        // Configurar acceso público para archivos raw
        await cloudinary.api.update_resources_access_mode_by_tag(
            'public',
            'evidencias',
            { resource_type: 'raw' }
        );
        console.log('✅ Configuración de Cloudinary completada');
    } catch (error) {
        console.error('⚠️ Aviso de configuración de Cloudinary:', error.message);
    }
};

// Función para generar URLs optimizadas
const generateCloudinaryUrls = (result, fileInfo) => {
    let baseUrl = result.secure_url;
    
    // Para PDFs y otros documentos, usar /raw/ en lugar de /image/
    if (!fileInfo.mimetype.startsWith('image/')) {
        baseUrl = baseUrl.replace('/image/upload/', '/raw/upload/');
    }

    // URL para visualización en línea (sin descarga)
    let viewUrl = baseUrl;
    if (!viewUrl.includes('fl_attachment')) {
        viewUrl = viewUrl.replace('/upload/', '/upload/fl_attachment:false/');
    }
    
    // URL para descarga con nombre original
    const downloadUrl = baseUrl.replace('/upload/', `/upload/fl_attachment:${encodeURIComponent(fileInfo.originalname)}/`);

    // Asegurar HTTPS
    return {
        viewUrl: viewUrl.replace('http://', 'https://'),
        downloadUrl: downloadUrl.replace('http://', 'https://')
    };
};

// Ejecutar configuración
configureCloudinary();

export { cloudinary as default, generateCloudinaryUrls };
