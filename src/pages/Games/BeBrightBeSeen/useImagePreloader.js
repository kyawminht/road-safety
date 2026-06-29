import { useState, useEffect } from "react";

export function useImagePreloader(imageSrcs) {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!imageSrcs || imageSrcs.length === 0) {
      setLoading(false);
      return;
    }

    let loaded = 0;
    const total = imageSrcs.length;
    const loadedImages = {};

    const promises = imageSrcs.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadedImages[src] = img;
            loaded++;
            setProgress(Math.round((loaded / total) * 100));
            resolve();
          };
          img.onerror = () => {
            // Store null so we know it failed — game uses silhouette fallback
            loadedImages[src] = null;
            loaded++;
            setProgress(Math.round((loaded / total) * 100));
            resolve();
          };
          img.src = src;
        })
    );

    Promise.all(promises).then(() => {
      setImages(loadedImages);
      setLoading(false);
    });
  }, [imageSrcs]);

  return { images, loading, progress };
}
