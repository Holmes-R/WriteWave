import ImageKit from "imagekit";



var imagekit = new ImageKit({
    publicKey : IMAGEKIT_PUBLIC_KEY,
    privateKey : IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

export default imagekit