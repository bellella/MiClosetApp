import { CollectionBasicFragment } from "@/lib/graphql/categories/categories.graphql";

export type MenuItem = {
  __typename?: "MenuItem" | undefined;
  title: string;
  resource?: CollectionBasicFragment;
};
