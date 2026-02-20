export const generateThumbnail = (imageUrl: string, width: number = 300, height: number = 300): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }

            // Calculate aspect ratio and crop position
            const scale = Math.max(width / img.width, height / img.height);
            const x = (width / scale - img.width) / 2;
            const y = (height / scale - img.height) / 2;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale); // Center crop
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = (err) => reject(err);
    });
};
