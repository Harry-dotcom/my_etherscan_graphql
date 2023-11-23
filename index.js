const { ApolloServer } = require("apollo-server");
// Import the GraphQL schema from the schema.graphql file
const { importSchema } = require("graphql-import");  
const EtherDataSource = require("./datasource/ethDatasource");
const typeDefs = importSchema("./schema.graphql");

require("dotenv").config();

const resolvers = {
  Query: {
    getEthByAddress: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),
    getTotalSupplyEth: (root, _args, { dataSources }) => 
      dataSources.ethDataSource.totalSupplyOfEther(),
    
    // Resolver to get the latest Ethereum price
    getEthPrice: (root, _args, { dataSources }) =>  
      dataSources.ethDataSource.getLatestEthereumPrice(),
      
    // Resolver to get estimated confirmation time per Ethereum transaction 
    getEstimationTimePerTransaction: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(),
  }), 
});

server.timeout = 0;
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
