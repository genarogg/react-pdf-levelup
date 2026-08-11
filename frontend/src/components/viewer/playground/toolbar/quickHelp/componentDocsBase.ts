import { type TabId, type BaseComponentDoc } from "./types";

export const componentDocsBase: Record<TabId, BaseComponentDoc[]> = {
  layout: [
    {
      name: "Layout",
      props: [
        {
          name: "size",
          type: "PageSizeInput",
          default: "A4",
        },
        {
          name: "orientation",
          type: '"vertical"|"horizontal"|"portrait"|"landscape"|"h"|"v"',
          default: "vertical",
        },
        { name: "backgroundColor", type: "string", default: "white" },
        { name: "backgroundImage", type: "string", default: "" },
        { name: "backgroundImageOpacity", type: "number", default: "1" },
        {
          name: "padding",
          type: "number",
          default: "30",
        },
        {
          name: "margin",
          type: '"apa"|"normal"|"estrecho"|"ancho"|number',
          default: "normal",
        },
        { name: "style", type: "object", default: "{}" },
        { name: "footerLines", type: "number", default: "1" },
        { name: "pagination", type: "boolean", default: "true" },
        { name: "paginationStyle", type: "any", default: "" },
        {
          name: "rule",
          type: "boolean",
          default: "false",
        },
        { name: "debug", type: "boolean", default: "false" },
        { name: "dpi", type: "number", default: "" },
        { name: "id", type: "string", default: "" },
        {
          name: "meta",
          type: "DocumentMeta",
          default: "{}",
        },
      ],
    },
    {
      name: "LayoutMultiPage",
      props: [
        { name: "size", type: "PageSizeInput", default: "A4" },
        {
          name: "orientation",
          type: '"vertical"|"horizontal"|"portrait"|"landscape"|"h"|"v"',
          default: "vertical",
        },
        { name: "backgroundColor", type: "string", default: "white" },
        { name: "backgroundImage", type: "string", default: "" },
        { name: "backgroundImageOpacity", type: "number", default: "1" },
        { name: "padding", type: "number", default: "30" },
        {
          name: "margin",
          type: '"apa"|"normal"|"estrecho"|"ancho"|number',
          default: "normal",
        },
        { name: "footerLines", type: "number", default: "1" },
        { name: "pagination", type: "boolean", default: "true" },
        { name: "paginationStyle", type: "any", default: "" },
        { name: "rule", type: "boolean", default: "false" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "meta", type: "DocumentMeta", default: "{}" },
      ],
    },
    {
      name: "Section",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "backgroundColor", type: "string", default: "Heredado" },
        { name: "backgroundImage", type: "string", default: "Heredado" },
        { name: "backgroundImageOpacity", type: "number", default: "Heredado" },
        { name: "padding", type: "number", default: "Heredado" },
        {
          name: "margin",
          type: '"apa"|"normal"|"estrecho"|"ancho"|number',
          default: "Heredado",
        },
        { name: "footerLines", type: "number", default: "Heredado" },
        { name: "pagination", type: "boolean", default: "Heredado" },
        { name: "paginationStyle", type: "any", default: "Heredado" },
        { name: "rule", type: "boolean", default: "Heredado" },
        { name: "debug", type: "boolean", default: "Heredado" },
        { name: "dpi", type: "number", default: "" },
        { name: "id", type: "string", default: "" },
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
        { name: "color", type: "string", default: "" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Blockquote",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "color", type: "string", default: "" },
        { name: "debug", type: "boolean", default: "false" },
        { name: "fixed", type: "boolean", default: "false" },
        { name: "break", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Mark",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "color", type: "string", default: "" },
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
        { name: "src", type: "string", default: "" },
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
      props: [
        { name: "style", type: "any", default: "{}" },
        { name: "cellHeight", type: "number", default: "22" },
        { name: "borderColor", type: "string", default: "#000" },
        { name: "textColor", type: "string", default: "#000" },
        { name: "headerBackground", type: "string", default: "#ccc" },
        { name: "zebra", type: "boolean", default: "true" },
        { name: "zebraColor", type: "string", default: "#eeeeee" },
        {
          name: "grid",
          type: '"grid"|"modern"|"not-grid"',
          default: "grid",
        },
        {
          name: "borderRadiusMethod",
          type: '"view"|"svg"',
          default: "svg",
        },
        {
          name: "rowsPerPage",
          type: "Array<{ nRow: number; break?: boolean }>",
          default: "",
        },
      ],
    },
    {
      name: "Thead",
      props: [
        { name: "style", type: "any", default: "{}" },
        {
          name: "textAlign",
          type: '"left"|"center"|"right"',
          default: "left",
        },
        { name: "borderColor", type: "string", default: "" },
        { name: "textColor", type: "string", default: "" },
      ],
    },
    {
      name: "Tbody",
      props: [
        { name: "borderColor", type: "string", default: "" },
        { name: "textColor", type: "string", default: "" },
      ],
    },
    {
      name: "Tr",
      props: [
        { name: "style", type: "any", default: "{}" },
        { name: "isLastRow", type: "boolean", default: "false" },
        { name: "isOdd", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Th",
      props: [
        { name: "style", type: "any", default: "{}" },
        { name: "width", type: "string|number", default: "" },
        { name: "height", type: "string|number", default: "" },
        { name: "colSpan", type: "number", default: "1" },
        {
          name: "textAlign",
          type: '"left"|"center"|"right"',
          default: "left",
        },
        { name: "text", type: "boolean", default: "true" },
      ],
    },
    {
      name: "Td",
      props: [
        { name: "style", type: "any", default: "{}" },
        { name: "width", type: "string|number", default: "" },
        { name: "height", type: "string|number", default: "" },
        { name: "colSpan", type: "number", default: "1" },
        {
          name: "textAlign",
          type: '"left"|"center"|"right"',
          default: "left",
        },
        { name: "text", type: "boolean", default: "true" },
      ],
    },
  ],
  position: [
    {
      name: "Left",
      props: [
        { name: "style", type: "any", default: "" },
        { name: "vertical", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Right",
      props: [
        { name: "style", type: "any", default: "" },
        { name: "vertical", type: "boolean", default: "false" },
      ],
    },
    {
      name: "Center",
      props: [
        { name: "style", type: "any", default: "" },
        { name: "vertical", type: "boolean", default: "false" },
      ],
    },
  ],
  lists: [
    {
      name: "UL",
      props: [
        { name: "style", type: "object", default: "{}" },
        { name: "type", type: '"disc"|"circle"|"square"|"none"', default: "disc" },
        { name: "fontSize", type: "number", default: "" },
        { name: "bulletColor", type: "string", default: "" },
      ],
    },
    {
      name: "OL",
      props: [
        { name: "style", type: "object", default: "{}" },
        {
          name: "type",
          type: '"decimal"|"lower-alpha"|"upper-alpha"|"lower-roman"|"upper-roman"|"none"',
          default: "decimal",
        },
        { name: "start", type: "number", default: "1" },
        { name: "fontSize", type: "number", default: "" },
        { name: "bulletColor", type: "string", default: "" },
      ],
    },
    {
      name: "LI",
      props: [
        { name: "style", type: "object", default: "{}" },
        {
          name: "bulletType",
          type: '"disc"|"circle"|"square"|"none"|"decimal"|"lower-alpha"|"upper-alpha"|"lower-roman"|"upper-roman"',
          default: "disc",
        },
        { name: "isOrdered", type: "boolean", default: "false" },
        { name: "index", type: "number", default: "1" },
        { name: "start", type: "number", default: "1" },
        { name: "fontSize", type: "number", default: "" },
        { name: "bulletColor", type: "string", default: "" },
      ],
    },
  ],
  media: [
    {
      name: "Img",
      props: [
        { name: "src", type: "string", default: "" },
        { name: "style", type: "object", default: "{}" },
        { name: "width", type: "string|number", default: "100%" },
        { name: "height", type: "string|number", default: "auto" },
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
  advanced: [
    {
      name: "Badge",
      props: [
        {
          name: "variant",
          type: '"default"|"active"|"pending"|"cancelled"|"success"|"warning"|"error"|"info"',
          default: "default",
        },
        { name: "size", type: '"sm"|"md"|"lg"', default: "md" },
        { name: "style", type: "any", default: "" },
      ],
    },
    {
      name: "Button",
      props: [
        {
          name: "variant",
          type: '"primary"|"secondary"|"success"|"danger"|"outline"',
          default: "primary",
        },
        { name: "size", type: '"sm"|"md"|"lg"', default: "md" },
        { name: "disabled", type: "boolean", default: "false" },
        { name: "href", type: "string", default: "" },
        { name: "width", type: "number|string", default: "" },
        { name: "height", type: "number|string", default: "" },
        { name: "style", type: "any", default: "" },
        { name: "textStyle", type: "any", default: "" },
      ],
    },
    {
      name: "Divider",
      props: [
        { name: "label", type: "string", default: "" },
        { name: "variant", type: '"line"|"dashed"|"dotted"', default: "line" },
        { name: "color", type: "string", default: "#d1d5db" },
        { name: "textColor", type: "string", default: "#6b7280" },
        { name: "fontSize", type: "number", default: "9" },
        { name: "marginVertical", type: "number", default: "16" },
        { name: "width", type: "number|string", default: "100%" },
        { name: "style", type: "any", default: "" },
      ],
    },
    {
      name: "Gradiant",
      props: [
        {
          name: "colors",
          type: "(string|{color,offset})[]",
          default: "",
        },
        { name: "width", type: "number|string", default: "100" },
        { name: "height", type: "number|string", default: "100" },
        { name: "type", type: '"linear"|"radial"', default: "linear" },
        { name: "shape", type: '"square"|"circle"', default: "square" },
        { name: "angle", type: "number", default: "90" },
        { name: "style", type: "any", default: "" },
      ],
    },
    {
      name: "Pass",
      props: [],
    },
    {
      name: "Graph",
      props: [
        {
          name: "variant",
          type: '"bar"|"horizontal-bar"|"line"|"area"|"pie"|"donut"',
          default: "",
        },
        { name: "series", type: "GraphSeries[]", default: "" },
        { name: "width", type: "number", default: "500" },
        { name: "height", type: "number", default: "300" },
        { name: "title", type: "string", default: "" },
        { name: "subtitle", type: "string", default: "" },
        { name: "colors", type: "string[]", default: "DEFAULT_COLORS" },
        { name: "showLegend", type: "boolean", default: "true" },
        { name: "showValues", type: "boolean", default: "false" },
        { name: "showDots", type: "boolean", default: "true" },
        { name: "smooth", type: "boolean", default: "false" },
        { name: "yTickCount", type: "number", default: "5" },
        { name: "style", type: "any", default: "" },
      ],
    },
    {
      name: "Form",
      props: [
        { name: "style", type: "any", default: "" },
        { name: "borderColor", type: "string", default: "#282828" },
        { name: "borderRadius", type: "number", default: "5" },
        { name: "labelColor", type: "string", default: "#333" },
        { name: "textColor", type: "string", default: "#000" },
      ],
    },
    {
      name: "Input",
      props: [
        { name: "label", type: "string", default: "" },
        { name: "placeholder", type: "string", default: "" },
        { name: "required", type: "boolean", default: "false" },
        { name: "width", type: "string|number", default: "100%" },
        { name: "height", type: "number", default: "" },
        { name: "style", type: "any", default: "" },
        { name: "labelStyle", type: "any", default: "" },
      ],
    },
    {
      name: "TextArea",
      props: [
        { name: "label", type: "string", default: "" },
        { name: "placeholder", type: "string", default: "" },
        { name: "required", type: "boolean", default: "false" },
        { name: "width", type: "string|number", default: "100%" },
        { name: "height", type: "number", default: "60" },
        { name: "style", type: "any", default: "" },
        { name: "labelStyle", type: "any", default: "" },
      ],
    },
    {
      name: "Checkbox",
      props: [
        { name: "label", type: "string", default: "" },
        { name: "checked", type: "boolean", default: "false" },
        { name: "style", type: "any", default: "" },
        { name: "labelStyle", type: "any", default: "" },
      ],
    },
  ],
};
