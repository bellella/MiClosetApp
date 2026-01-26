import { CollectionBasicFragment } from "@/lib/graphql/categories/categories.graphql";

export type Menu = {
  title: string;
  items: MenuItem[];
}

export type MenuItem = {
  __typename?: "MenuItem" | undefined;
  title: string;
  resource?: CollectionBasicFragment;
  items: MenuItem[];
};

export type SubMenuItem = {
  __typename?: "Collection" | undefined;
  id: string;
  title: string;
  handle: string;
  metafield: {
    references: {
      nodes: CollectionBasicFragment[];
    };
  };
};