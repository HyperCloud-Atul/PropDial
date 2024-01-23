import { useEffect, useState } from 'react'
import { useAuthContext } from './useAuthContext'
import Resizer from "react-image-file-resizer";

export const useImageUpload = () => {

    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isImgCompressPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    const [imgCompressedFile, setImgCompressedFile] = useState(null);

    const imgUpload = async (imgFile, imgWidth, imgHeight) => {
        setError(null)
        setIsPending(true)

        // console.log('Image Width: ', imgWidth)
        // console.log('Image Height: ', imgHeight)

        const resizeFile = (file, width, height) =>
            new Promise((resolve) => {
                Resizer.imageFileResizer(
                    file,
                    width,
                    height,
                    "JPEG",
                    80,
                    0,
                    (uri) => {
                        resolve(uri);
                    },
                    "base64"
                );
            });

        const dataURIToBlob = async (dataURI) => {
            const splitDataURI = dataURI.split(",");
            const byteString =
                splitDataURI[0].indexOf("base64") >= 0
                    ? atob(splitDataURI[1])
                    : decodeURI(splitDataURI[1]);
            const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
            const ia = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
            return new Blob([ia], { type: mimeString });
        };

        try {

            const image = await resizeFile(imgFile, imgWidth, imgHeight);
            // console.log('image resize', image);
            const imgcompressed = dataURIToBlob(image);
            // console.log('imgcompressed : ', imgcompressed)
            // console.log('imgcompressed size : ', (await imgcompressed).size)

            // update state
            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }

            return imgcompressed;
        }
        catch (err) {
            if (!isCancelled) {
                setError(err.message)
                setIsPending(false)
            }
            setError(err.message)
            console.log(err.message)
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { imgUpload, error, isImgCompressPending, imgCompressedFile }
}