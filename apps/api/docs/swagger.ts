import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Unipath",
      description: "API endpoints for Unipath services documented on swagger",
      contact: {
        name: "Chaman Budhathoki",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8000/",
        description: "Local server",
      },
      {
        url: "<your live url here>",
        description: "Live server",
      },
    ],
  },
  apis: ["./routers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
