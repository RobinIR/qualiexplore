export const environment = {
  production: true,
  socketUrlApi : "http://localhost:5005/", // Qualiexplore Assistant url
  auditUrlApi : "http://localhost:6005/", // Audit Assistant url
  authApi : "http://localhost:5000/graphql", // URL of the Apollo server that interacts with the MongoDB (has an integrated GraphQL server).
  graphApi: "http://localhost:4000/graphql"  // URL of the Apollo server that interacts with Neo4j.
};
