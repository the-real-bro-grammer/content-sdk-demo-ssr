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
    