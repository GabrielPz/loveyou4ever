import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";


interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export const uploadToFirebase = async(files: MulterFile[]) => {
  const uploadTasks = 
  files.map(async (file, index) => {
    if (file && (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')) {
      const uniqueId = (Date.now().toString() + Math.random().toString(36).substring(2)).substring(0, 6);
      const uniqueFileName = `${uniqueId}_${index}_${file.originalname.substring(0, 3)}`;
      const folder = 'images';
      const storageRef = ref(storage, `${folder}/${uniqueFileName}`);
      await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });
      return getDownloadURL(storageRef);
    }
    return null;
  })
  const downloadURLs = await Promise.all(uploadTasks);
  const validDownloadURLs = downloadURLs.filter(url => url !== null);
  return validDownloadURLs;
}