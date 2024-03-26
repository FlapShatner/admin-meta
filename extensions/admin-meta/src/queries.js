export const products = `
query {
    products(first: 250, query: "tag:'truck'") {
      edges {
        node {
          id
          title
          variants(first: 5) {
            edges {
              node {
                id
                title                
              }
            }
          }
        }
      }
    }
  }`

export const metafieldsSet = `
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {      
       value
      }
      userErrors {
        field
        message
      }
    }
  }`

