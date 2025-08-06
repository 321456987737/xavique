import ImageKit from "imagekit";

const imageKitConfig = new ImageKit({
       publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT
});

export default imageKitConfig;