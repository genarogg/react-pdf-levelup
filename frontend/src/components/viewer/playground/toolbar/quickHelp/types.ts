export type TabId = "layout" | "text" | "table" | "position" | "lists" | "media" | "page" | "fonts";

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentDoc {
  name: string;
  description: string;
  props: PropDoc[];
  example?: string;
}
