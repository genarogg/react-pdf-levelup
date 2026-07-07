import { Font } from "@react-pdf-levelup/core";

const GetFuentes = () => {
    Font.register({
        family: "Nunito",
        fonts: [
            {
                src: "https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKof4Mg.ttf",
                fontWeight: "normal",
            },
            {
                src: "https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofAjsOkZg.ttf",
                fontWeight: "bold",
            },
            {
                src: "https://fonts.gstatic.com/s/nunito/v12/XRXX3I6Li01BKofIMOaE.ttf",
                fontStyle: "italic",
                fontWeight: "normal",
            }
        ],
    });
}

export default GetFuentes;