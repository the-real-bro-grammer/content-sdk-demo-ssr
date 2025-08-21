export const defaultDatasourceQuery = `fragment ItemDetails on Item {
  name
  id
  url {
    path
  }
  fields {
    name
    definition {
      type
    }
    jsonValue
  }
  template {
    name
    id
  }
}

query DataSourceQuery($datasource: String!, $language: String!) {
  datasource: item(path: $datasource, language: $language) {
    ...ItemDetails
    children {
      results {
        ...ItemDetails
      }
    }
  }
}

`;  
    