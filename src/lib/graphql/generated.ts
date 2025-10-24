export const defaultDatasourceQuery = `query ($datasource: String!, $contextItem: String!, $language: String!) {
  datasource: item(path: $datasource, language: $language) {
    id
    name
    title: field(name: "Title") {
      value
    }
    children {
      results {
        title: field(name: "Title") {
          value
        }
      }
    }
  }
  contextItem: item(path: $contextItem, language: $language) {
    id
    name
    title: field(name: "Title") {
      value
    }
    navTitle: field(name: "NavigationTitle") {
      value
    }
  }
}
`;  
    export const getAllBucketItemsQuery = `fragment ItemDetails on Item {
  name
  lastMod: field(name: "__Updated") {
    value
  }
}

query DataSourceQuery($path: String!, $template: String!) {
  searchResults: search(
    where: {
      AND: [
        { name: "_templates", value: $template, operator: CONTAINS }
        { name: "_path", value: $path, operator: CONTAINS }
      ]
    }
  ) {
    results {
      ...ItemDetails
    }
  }
}
`;  
    export const relatedBlogsQuery = `fragment ItemDetails on Item {
  id
  title: field(name: "Title") {
    value
  }
  urlWrapper: url {
    url
  }
  image: field(name: "Image") {
    jsonValue
  }
}

query ItemListingSearch(
  $startSearchLocation: String!
  $currentBlog: String!
  $category: String!
  $first: Int = 3
) {
  searchResults: search(
    where: {
      AND: [
        { name: "_path", value: $startSearchLocation, operator: CONTAINS }
        { name: "category", value: $category, operator: EQ }
        { name: "_path", value: $currentBlog, operator: NCONTAINS }
      ]
    }
    first: $first
  ) {
    total
    pageInfo {
      endCursor
      hasNext
    }
    results {
      ...ItemDetails
    }
  }
}
`;  
    