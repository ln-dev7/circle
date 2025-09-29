import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
   const spec = createSwaggerSpec({
      apiFolder: 'app/api', // define api folder under app folder
      definition: {
         openapi: '3.0.0',
         info: {
            title: 'Next Swagger API Example',
            version: '1.0',
         },
         components: {
            securitySchemes: {
               BearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
               },
            },
         },
         security: [],
      },
   });
   return spec;
};
