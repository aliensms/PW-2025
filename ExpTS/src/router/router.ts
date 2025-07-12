import { Router } from "express";
import mainController from "../controller/mainController";
import majorController from "../controller/major.controller";
import userController from "../controller/user.controller"; // Import the new user controller
import gameController from "../controller/game.controller";
import { checkAuth } from "../middlewares/checkAuth";

const router = Router();

router.get("/", mainController.main)
router.get("/game", checkAuth, mainController.game);
router.get("/bem-vindo/:nome", mainController.greetings)
router.get("/about", mainController.about);
router.get("/hb1", mainController.hb1);
router.get("/hb2", mainController.hb2);
router.get("/hb3", mainController.hb3);
router.get("/hb4", mainController.hb4);
router.get("/lorem", mainController.lorem);
router.get('/cookie', mainController.testeCookie)


router.get("/majors/", majorController.index)
router.all("/majors/create", checkAuth, majorController.create)
router.get("/majors/read/:id", majorController.read)
router.all("/majors/update/:id", checkAuth, majorController.update)
router.post("/majors/remove/:id", checkAuth, majorController.remove);

router.get("/users/", userController.index);
router.all("/users/create", userController.create);
router.get("/users/read/:id", userController.read)
router.all("/users/update/:id", checkAuth, userController.update)
router.post("/users/remove/:id", checkAuth, userController.remove);

router.get("/users/profile", checkAuth, userController.updateProfileData);
router.post("/users/profile/update", checkAuth, userController.updateProfileData);

router.get("/users/profile/password", (req, res) => {
    res.redirect("/users/profile");
});
router.post("/users/profile/password", checkAuth, userController.updatePass);


router.route('/ranking')
    .get(gameController.leaderboard)      
    .post(checkAuth, gameController.leaderboard); 

    
router.all("/users/login", userController.login)
router.post("/users/logout", userController.logout)


router.use((req, res) => {
    res.status(404).send("Página não encontrada!");
})

export default router;