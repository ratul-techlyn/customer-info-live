// Fetch all data from the query
export async function fetchAllData(admin, query) {
  let allData = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    try {
      const response = await admin.graphql(query, {
        variables: {
          after: cursor,
        },
      });

      const responseJson = await response.json();
      const responseData = responseJson.data;

      const data = responseData[Object.keys(responseData)[0]];
      allData = allData.concat(data.edges.map((edge) => edge.node));

      console.log(responseData);

      hasNextPage = data.pageInfo.hasNextPage;
      cursor = data.pageInfo.endCursor;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      break;
    }
  }

  return allData;
}

// Execute a GraphQL mutation
export async function executeGraphQL(admin, mutation, variables = {}) {
  try {
    const response = await admin.graphql(
      mutation,
      { variables }, // Pass variables if required
    );

    const responseJson = await response.json();
    const responseData = responseJson.data;

    if (response.errors) {
      console.error("GraphQL Errors:", response.errors);
      throw new Error("Failed to execute GraphQL query/mutation.");
    }

    return responseData; // Return the data portion of the response
  } catch (error) {
    console.error("GraphQL Execution Error:", error.message);
    throw error;
  }
}

