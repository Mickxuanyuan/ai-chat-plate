export type Alignment = "righteous" | "evil";

export type ExampleCharacter = {
  id: string;
  name: string;
  alignment: Alignment;
  createdAt: string;
};

export type ExampleListResponse = {
  items: ExampleCharacter[];
};

export type ExampleCreateBody = {
  name: string;
  alignment: Alignment;
};

export type ExampleCreateResponse = {
  item: ExampleCharacter;
};
