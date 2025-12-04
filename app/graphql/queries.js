// get all products
export const getAllProductsQuery = `#graphql
query GetAllProducts($after: String) {
  products(first: 250, after: $after) {
    edges {
      node {
        id
        title
        handle
				featuredMedia{
          preview{
            image{
              url
            }
          }
        }
        options{
          name
          values
        }
        collections(first: 250){
          edges{
            node{
              id
              title
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

// get all orders
export const getAllOrdersQuery = `#graphql
query GetOrders($after: String) {
  orders(first: 250, after: $after) {
    edges {
      node {
        id
        name
        email
        createdAt
        subtotalPriceSet {
          shopMoney {
            amount
          }
        }
        customer {
          id
          firstName
          lastName
          defaultAddress {
            city
            phone
          }
        }
        lineItems(first: 50) {
          edges {
            node {
              name
            }
          }
        }
        currentShippingPriceSet {
          shopMoney {
            amount
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;



// get customer info
export const getCustomerQuery = `#graphql
query GetCustomer($id: ID!) {
  customer(id: $id) {
    id
    firstName
  }
}`;


// get shop info
export const getShopQuery = `#graphql
query GetShop {
  shop {
    id
    name
    primaryDomain {
      url
    }
  }
}`;
