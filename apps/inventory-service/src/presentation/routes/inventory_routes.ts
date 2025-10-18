import { Router } from "express";
import { InventoryController } from "../controllers/inventory_controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

export class InventoryRoutes{

   static get routes(): Router{
 
    const router= Router();

     const controller=new InventoryController()
     router.post('/profile',AuthMiddleware.validateJWT,controller.profile,);

     return router;
   }  


  

}