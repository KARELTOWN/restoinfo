import FonctionnaliteRestoSeeder from "./FontionnaliteRestoSeeder.js";
import RegimeSeeder from "./RegimeSeeder.js";
import RoleSeeder from "./RoleSeeder.js";
import TypeCuisineSeeder from "./TypeCuisineSeeder.js";
import TypeRepasSeeder from "./TypeRepasSeeder.js";

FonctionnaliteRestoSeeder().catch((err) =>
  console.log("erreur FonctionnaliteRestoSeeder ", err)
);
RegimeSeeder().catch((err) => console.log("erreur RegimeSeeder ", err));
RoleSeeder().catch((err) => console.log("erreur seeder role ", err));

TypeCuisineSeeder().catch((err) =>
  console.log("erreur TypeCuisineSeeder ", err)
);
TypeRepasSeeder().catch((err) => console.log("erreur TypeRepasSeeder ", err));
