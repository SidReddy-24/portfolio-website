import { useEffect, useRef, useState } from 'react';

const ScrollCanvas = ({ onProgress }) => {
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const frameCount = 240; // Total frames found

    useEffect(() => {
        const loadImages = async () => {
            let loadedCount = 0;
            const imagePromises = Array.from({ length: frameCount }, (_, i) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    const frameNumber = (i + 1).toString().padStart(3, '0');
                    img.src = `/frames/ezgif-frame-${frameNumber}.jpg`;
                    img.onload = () => {
                        loadedCount++;
                        if (onProgress) {
                            onProgress(Math.floor((loadedCount / frameCount) * 100));
                        }
                        resolve(img);
                    };
                    img.onerror = () => {
                        loadedCount++;
                        if (onProgress) {
                            onProgress(Math.floor((loadedCount / frameCount) * 100));
                        }
                        resolve(null); // Resolve with null on error to keep things moving
                    };
                });
            });

            const loadedImages = await Promise.all(imagePromises);
            setImages(loadedImages.filter(img => img !== null));
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    useEffect(() => {
        if (!isLoaded || !images.length) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas dimensions to window size * DPR for high-res displays
        const updateSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
        };
        updateSize();

        const render = () => {
            // Calculate scroll progress
            // Maximum scrollable height
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPos = window.scrollY;
            const scrollFraction = Math.max(0, Math.min(1, scrollPos / maxScroll));

            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(scrollFraction * frameCount)
            );

            const img = images[frameIndex];

            if (img) {
                // Draw image to cover canvas (like object-fit: cover)
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }

            requestAnimationFrame(render);
        };

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
        };

        window.addEventListener('resize', handleResize);
        const animationId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, [isLoaded, images]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full object-cover z-0"
            />
            <div className="fixed inset-0 w-full h-full bg-black/70 z-0" />
        </>
    );
};

export default ScrollCanvas;
