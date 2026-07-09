export type TabId = "layout" | "text" | "table" | "position" | "lists" | "media" | "page" | "fonts";

export interface BasePropDoc {
  name: string;
  type: string;
  default?: string;
}

export interface BaseComponentDoc {
  name: string;
  props: BasePropDoc[];
}

export interface PropDoc extends BasePropDoc {
  description: string;
}

export interface ComponentDoc extends BaseComponentDoc {
  description: string;
  example?: string;
}

export interface LocalizedComponentText {
  description?: string;
  props: Record<string, string>;
  example?: string;
}

export type ComponentDocsText = Record<TabId, Record<string, LocalizedComponentText>>;
