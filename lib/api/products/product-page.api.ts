import { graphql } from '../index';

const GET_PAGE_COLLECTIONS_QUERY = `
query GetHomePageCollections {
  metaobjects(type: "home_page_collections", first: 1) {
    edges {
      node {
        id
        handle
        fields {
          key
          value
        }
      }
    }
  }
}
`;

type MetaobjectField = {
  key: string;
  value: string;
};

type GetPageCollectionsResponse = {
  metaobjects: {
    edges: {
      node: {
        id: string;
        handle: string;
        fields: MetaobjectField[];
      };
    }[];
  };
};

export const getPageCollections = async (): Promise<string[]> => {
  const data = await graphql<GetPageCollectionsResponse>(
    GET_PAGE_COLLECTIONS_QUERY
  );
  console.log(data, '??datatat');

  if (!data.metaobjects.edges.length) {
    console.warn('No metaobjects found');
    return [];
  }

  try {
    const fields = data.metaobjects.edges[0].node.fields;
    const collectionHandlesField = fields.find(
      (field) => field.key === 'collection_handles'
    );

    if (collectionHandlesField && collectionHandlesField.value) {
      return JSON.parse(collectionHandlesField.value) as string[];
    } else {
      console.warn('No collection_handles field found');
      return [];
    }
  } catch (error) {
    console.error('Failed to parse collection_handles field:', error);
    return [];
  }
};
