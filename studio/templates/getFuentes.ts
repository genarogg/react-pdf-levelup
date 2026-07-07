import { Font } from "@react-pdf-levelup/core";

const getFuentes = () => {
    Font.register({
        family: "courierPrime",
        fonts: [
            {
                src: "http://genarogg.github.io/media/font/courier-prime/ttf/courierprime-regular.ttf",
                fontWeight: "normal",
            },
            {
                src: "http://genarogg.github.io/media/font/courier-prime/ttf/courierprime-bold.ttf",
                fontWeight: "bold",
            }
        ],
    });
}

export default getFuentes;