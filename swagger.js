const Router = require("koa-router");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDefinition = {
    info: {
        title: "Meme Launch API文档",
        version: "1.0.0.",
        description: "Meme Launch Api Swagger Ui",
    },
}
const options = {
    swaggerDefinition,
    apis: ["routes/public.js"]
}
const swaggerSpec = swaggerJSDoc(options);

const swaggerInstall = function(app) {
    const router = new Router();
    router.get('/swagger.json',async function(ctx){
        ctx.set("Content-Type",'application/json');
        ctx.body = swaggerSpec;
    });
    app.use(router.routes());
    app.use(router.allowedMethods());
}


module.exports = swaggerInstall;