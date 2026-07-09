import { componentDocsBase } from "./componentDocsBase";
import { componentDocsText_en } from "./componentDocsText_en";
import { componentDocsText_es } from "./componentDocsText_es";
import { type ComponentDocsText,type ComponentDoc,type PropDoc, type TabId } from "./types";

type Language = "en" | "es";

const componentDocsText: Record<Language, ComponentDocsText> = {
  en: componentDocsText_en,
  es: componentDocsText_es,
};

export function buildComponentDocs(lang: Language): Record<TabId, ComponentDoc[]> {
  const localizedDocs: Record<TabId, ComponentDoc[]> = {} as Record<TabId, ComponentDoc[]>;
  const currentText = componentDocsText[lang];

  for (const tabId in componentDocsBase) {
    if (Object.prototype.hasOwnProperty.call(componentDocsBase, tabId)) {
      localizedDocs[tabId as TabId] = componentDocsBase[tabId as TabId].map((baseComponent) => {
        const componentText = currentText[tabId as TabId]?.[baseComponent.name];

        const props: PropDoc[] = baseComponent.props.map((baseProp) => {
          const propDescription = componentText?.props?.[baseProp.name] || "";
          return {
            ...baseProp,
            description: propDescription,
          };
        });

        return {
          ...baseComponent,
          description: componentText?.description || "",
          props,
          example: componentText?.example,
        };
      });
    }
  }

  return localizedDocs;
}
