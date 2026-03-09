
export const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/400x400?text=No+Image";

    let finalPath = path;
    if (path.startsWith('http')) {
        finalPath = path;
    } else {
        const cleanPath = path.toString().replace(/\\/g, '/').replace(/^uploads[\\/]/, '');
        if (cleanPath.startsWith('http')) {
            finalPath = cleanPath;
        } else {
            // Ensure no double /api
            const baseURL = import.meta.env.VITE_APP_BASEURL || '';
            finalPath = `${baseURL}/uploads/${cleanPath}`.replace(/\/+/g, '/');
            if (!finalPath.startsWith('http') && !finalPath.startsWith('/')) {
                finalPath = '/' + finalPath;
            }
        }
    }

    // Add Cloudinary optimizations if it's a cloudinary URL
    if (finalPath.includes('cloudinary.com')) {
        // Only add if not already present
        if (!finalPath.includes('/q_auto')) {
            return finalPath.replace('/upload/', '/upload/q_auto,f_auto/');
        }
    }
    return finalPath;
};
