import { type TabId, type BaseComponentDoc } from "./types";

export const componentDocsBase: Record<TabId, BaseComponentDoc[]> = {
  layout: [
    {
      name: "Layout",
      props: [
        {
          name: "size",
          type: "string",
          default: "A4",
        },
        {
          name: "orientation",
          type: "string",
          default: "vertical",
        },
        { name: "backgroundColor", type: "string", default: "white" },
        {
          name: "padding",
          type: "number",
          default: "30",
        },
        {
          name: "margin",
          type: "string",
          default: "normal",
        },
        { name: "style", type: "object", default: "{}" },
        { name: "footer", type: "ReactNode", default: "" },
        { name: "footerLines", type: "number", default: "1" },
        { name: "pagination", type: "boolean", default: "true" },
        {
          name: "rule",
          type: "boolean",
          default: "false",
        },
        {
          name: "meta",
          type: "object",
          default: "{}",
        },
      ],
    },
    {
      name: "LayoutMultiPage",
      props: [
        { name: "size", type: "string", default: "A4" },
        { name: "orientation", type: "string", default: "vertical" },
        { name: "backgroundColor", type: "string", default: "white" },
        { name: "padding", type: "number", default: "30" },
        {
          name: "margin",
          type: "string",
          default: "normal",
        },
        { name: "footer", type: "ReactNode", default: "" },
        { name: "pagination", type: "boolean", default: "true" },
        { name: "debug", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Section",
      props: [
        { name: "backgroundColor", type: "string", default: "Inherited" },
        { name: "padding", type: "number", default: "Inherited" },
        { name: "margin", type: "string", default: "Inherited" },
        { name: "footer", type: "ReactNode", default: "Inherited" },
        { name: "pagination", type: "boolean", default: "Inherited" },
        { name: "debug", type: "boolean", default: "Inherited" },
      ],
    },
    {
      name: "Container",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Row",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Col1-Col12",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Div",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
  ],
  text: [
    {
      name: "P, H1-H6",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Strong, Em, U, Small",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Blockquote",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Mark",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Span",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "BR",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "HR",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "A",
      props: [
        { name: "href", type: "string", default: "" },
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
  ],
  table: [
    {
      name: "Table (Tablet)",
      props: [{ name: "style", type: "object", default: "{}" }],
    },
    {
      name: "Thead",
      props: [{ name: "style", type: "object", default: "{}" }],
    },
    {
      name: "Tbody",
      props: [{ name: "style", type: "object", default: "{}" }],
    },
    {
      name: "Tr",
      props: [{ name: "style", type: "object", default: "{}" }],
    },
    {
      name: "Th",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "width", type: "string|number", default: "" },
        { name: "height", type: "string|number", default: "" },
        { name: "colSpan", type: "number", default: "" },
        {
          name: "textAlign",
          type: "string",
          default: "left",
        },
      ],
    },
    {
      name: "Td",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "width", type: "string|number", default: "" },
        { name: "height", type: "string|number", default: "" },
        { name: "colSpan", type: "number", default: "" },
        {
          name: "textAlign",
          type: "string",
          default: "left",
        },
      ],
    },
  ],
  position: [
    {
      name: "Left",
      props: [{ name: "style", type: "object", default: "{}" }],
    },
    {
      name: "Right",
      props: [{ name: "style", type: "object", default: "{}" }],
    },
    {
      name: "Center",
      props: [{ name: "style", type: "object", default: "{}" }],
    },
  ],
  lists: [
    {
      name: "UL",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "type", type: "string", default: "disc" },
      ],
    },
    {
      name: "OL",
      props: [
        { name: "style", type: "object", default: "{}" },
        {
          name: "type",
          type: "string",
          default: "decimal",
        },
        { name: "start", type: "number", default: "1" },
      ],
    },
    {
      name: "LI",
      props: [
        { name: "style", type: "object", default: "{}" },
        {
          name: "value",
          type: "number|string",
          default: "",
        },
      ],
    },
  ],
  media: [
    {
      name: "Img",
      props: [
        { name: "src", type: "string", default: "" },
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "ImgBg",
      props: [
        { name: "src", type: "string", default: "" },
        { name: "width", type: "number|string", default: "100%" },
        { name: "height", type: "number|string", default: "100%" },
        { name: "opacity", type: "number", default: "0.2" },
        {
          name: "objectFit",
          type: "string",
          default: "cover",
        },
        { name: "objectPosition", type: "string", default: "center" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "QR",
      props: [
        { name: "url", type: "string", default: "" },
        { name: "size", type: "number", default: "150" },
        { name: "colorDark", type: "string", default: "#000000" },
        { name: "colorLight", type: "string", default: "#ffffff" },
        { name: "margin", type: "number", default: "0" },
        {
          name: "errorCorrectionLevel",
          type: "string",
          default: "M",
        },
        { name: "logo", type: "string", default: "" },
        { name: "logoWidth", type: "number", default: "30" },
        { name: "logoHeight", type: "number", default: "30" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "QRstyle",
      props: [
        { name: "url", type: "string", default: "" },
        { name: "size", type: "number", default: "300" },
        { name: "image", type: "string", default: "" },
        { name: "dotsOptions", type: "object", default: "{}" },
        {
          name: "backgroundOptions",
          type: "object",
          default: "{ color: #ffffff }",
        },
        {
          name: "imageOptions",
          type: "object",
          default: "{ margin: 0, imageSize: 0.4 }",
        },
        {
          name: "cornersSquareOptions",
          type: "object",
          default: "{}",
        },
        { name: "cornersDotOptions", type: "object", default: "{}" },
        { name: "colorDark", type: "string", default: "" },
        { name: "colorLight", type: "string", default: "" },
        { name: "margin", type: "number", default: "0" },
        {
          name: "errorCorrectionLevel",
          type: "string",
          default: "M",
        },
        { name: "style", type: "object", default: "{}" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
  ],
  page: [
    {
      name: "Page Footer (Layout.footer)",
      props: [
        { name: "footer", type: "ReactNode", default: "" },
        { name: "footerLines", type: "number", default: "1" },
      ],
    },
  ],
  fonts: [
    {
      name: "Default Fonts",
      props: [],
    },
    {
      name: "Font.register",
      props: [
        { name: "family", type: "string", default: "" },
        { name: "fonts", type: "object[]", default: "[]" },
      ],
    },
  ],
};
