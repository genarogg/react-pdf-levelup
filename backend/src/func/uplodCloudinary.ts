import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';
import path from 'path';

import { Readable } from 'stream';

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

/**
 * Configura Cloudinary con tus credenciales
 */
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME || '',
    api_key: CLOUDINARY_API_KEY || '',
    api_secret: CLOUDINARY_API_SECRET || ''
});

/**
 * Verifica si el archivo es una imagen basado en su mimetype
 * @param mimetype - Tipo MIME del archivo
 * @returns Booleano indicando si es una imagen
 */
const esImagen = (mimetype: string): boolean => {
    return mimetype.startsWith('image/');
};

/**
 * Determina el tipo de recurso para Cloudinary basado en el mimetype
 * @param mimetype - Tipo MIME del archivo
 * @returns Tipo de recurso para Cloudinary (image, video, raw, auto)
 */
const getResourceType = (mimetype: string): string => {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'video'; // Cloudinary maneja audio bajo 'video'
    return 'raw'; // Para PDF y otros archivos
};

/**
 * Obtiene la extensión del archivo basada en el mimetype
 * @param mimetype - Tipo MIME del archivo
 * @returns Extensión del archivo (sin el punto)
 */
const getExtensionFromMimetype = (mimetype: string): string => {
    const mimeTypeMap: {[key: string]: string} = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'application/pdf': 'pdf',
        'audio/mpeg': 'mp3',
        'audio/mp3': 'mp3',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg',
        'video/mp4': 'mp4',
        'video/quicktime': 'mov',
        'video/x-msvideo': 'avi',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'text/plain': 'txt',
        'text/csv': 'csv'
    };
    
    return mimeTypeMap[mimetype] || mimetype.split('/')[1] || 'bin';
};

/**
 * Información del archivo subido a Cloudinary
 */
interface ArchivoSubido {
    id: string;         // ID público del archivo (sin carpeta)
    format: string;     // Formato del archivo (extensión)
    fileName: string;   // Nombre completo del archivo (id.format)
    url: string;        // URL del archivo en Cloudinary
    secureUrl: string;  // URL segura del archivo
    resourceType: string; // Tipo de recurso en Cloudinary
    originalFilename: string; // Nombre original del archivo
}

/**
 * Sube un archivo multimedia desde GraphQL Upload a Cloudinary
 * @param file - Objeto Upload de GraphQL
 * @param folder - Carpeta opcional donde guardar en Cloudinary
 * @returns Objeto con información del archivo subido
 */
export const guardarArchivo = async (file: any, folder = 'uploads'): Promise<ArchivoSubido> => {
    try {
        const { createReadStream, filename, mimetype } = file.file;

        // Generar un hash único para el nombre del archivo
        const hash = crypto.createHash('md5').update(filename + Date.now().toString()).digest('hex');

        // Crear un stream para subir a Cloudinary
        const stream = createReadStream();

        // Determinar el tipo de recurso y opciones basadas en el mimetype
        const resourceType = getResourceType(mimetype);
        const uploadOptions: any = {
            folder: folder,
            public_id: hash,
            resource_type: resourceType
        };

        // Aplicar optimizaciones específicas para imágenes
        if (esImagen(mimetype)) {
            uploadOptions.format = 'webp'; // Convertir a WebP para optimización
            uploadOptions.quality = 'auto'; // Calidad automática para optimización
        }

        // Subir a Cloudinary usando una promesa
        return new Promise((resolve, reject) => {
            // Crear un buffer de almacenamiento del archivo en memoria
            const chunks: Buffer[] = [];

            stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));

            stream.on('error', (err: any) => reject(err));

            stream.on('end', async () => {
                try {
                    // Concatenar todos los chunks en un buffer
                    const buffer = Buffer.concat(chunks);

                    // Crear un stream a partir del buffer para enviar a Cloudinary
                    const streamBuffer = Readable.from(buffer);

                    // Subir a Cloudinary
                    const result = await new Promise<any>((resolveUpload, rejectUpload) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            uploadOptions,
                            (error, result) => {
                                if (error) {
                                    rejectUpload(error);
                                } else {
                                    resolveUpload(result);
                                }
                            }
                        );

                        streamBuffer.pipe(uploadStream);
                    });

                    // Extraer el ID público (sin la carpeta)
                    const publicId = result.public_id.split('/').pop();
                    
                    // Determinar el formato final del archivo
                    // Si es una imagen y se ha convertido a webp, usamos webp
                    // Si no, usamos el formato original o lo determinamos del mimetype
                    let format = result.format || getExtensionFromMimetype(mimetype);
                    
                    // Crear nombre completo del archivo (id.format)
                    const fileName = `${publicId}.${format}`;
                    
                    resolve({
                        id: publicId,
                        format: format,
                        fileName: fileName, // Nuevo campo unificado
                        url: result.url,
                        secureUrl: result.secure_url,
                        resourceType: result.resource_type,
                        originalFilename: filename
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('Error al subir el archivo a Cloudinary:', error);
        throw error;
    }
};

/**
 * Obtener la URL completa de Cloudinary para un archivo
 * @param publicId - ID público del archivo en Cloudinary
 * @param folder - Carpeta donde se guardó el archivo
 * @param mimetype - Tipo MIME del archivo (opcional, para determinar opciones)
 * @returns URL completa del archivo
 */
export const getCloudinaryUrl = (publicId: string, folder = 'uploads', mimetype?: string): string => {
    const options: any = {
        secure: true
    };

    const resourceType = mimetype ? getResourceType(mimetype) : 'image';

    // Aplicar opciones específicas para imágenes
    if (!mimetype || esImagen(mimetype)) {
        options.format = 'auto';
        options.quality = 'auto';
        options.fetch_format = 'auto';
        return cloudinary.url(`${folder}/${publicId}`, options);
    }

    // Para otros tipos de archivos, usamos una URL diferente
    const cloudName = cloudinary.config().cloud_name;
    return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${folder}/${publicId}`;
};

/**
 * Eliminar un archivo de Cloudinary
 * @param publicId - ID público del archivo en Cloudinary
 * @param folder - Carpeta donde se guardó el archivo
 * @param mimetype - Tipo MIME del archivo (opcional, para determinar tipo de recurso)
 * @returns Resultado de la operación
 */
export const eliminarArchivo = async (publicId: string, folder = 'uploads', mimetype?: string): Promise<any> => {
    try {
        const fullPublicId = `${folder}/${publicId}`;
        const resourceType = mimetype ? getResourceType(mimetype) : 'image';

        return await cloudinary.uploader.destroy(fullPublicId, {
            resource_type: resourceType
        });
    } catch (error) {
        console.error('Error al eliminar archivo de Cloudinary:', error);
        throw error;
    }
};

/**
 * Obtener información sobre un archivo en Cloudinary
 * @param publicId - ID público del archivo en Cloudinary
 * @param folder - Carpeta donde se guardó el archivo
 * @param mimetype - Tipo MIME del archivo (opcional, para determinar tipo de recurso)
 * @returns Información del archivo
 */
export const getInfoArchivo = async (publicId: string, folder = 'uploads', mimetype?: string): Promise<any> => {
    try {
        const fullPublicId = `${folder}/${publicId}`;
        const resourceType = mimetype ? getResourceType(mimetype) : 'image';

        return await cloudinary.api.resource(fullPublicId, {
            resource_type: resourceType
        });
    } catch (error) {
        console.error('Error al obtener información del archivo:', error);
        throw error;
    }
};