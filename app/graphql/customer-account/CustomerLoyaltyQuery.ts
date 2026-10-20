// NOTE: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_LOYALTY_QUERY = `#graphql
  query AfnanCustomerLoyalty {
    customer {
      firstName
      lastName
      creationDate
      emailAddress { emailAddress }
      phoneNumber { phoneNumber }
      defaultAddress { formatted }
      points: metafield(namespace: "loyalty", key: "points") { value }
      orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          cancelledAt
          financialStatus
          fulfillmentStatus
          statusPageUrl
          subtotal { amount currencyCode }
          totalPrice { amount currencyCode }
          lineItems(first: 3) { nodes { title quantity } }
        }
      }
    }
  }
` as const;
