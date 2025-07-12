import { Request, Response } from "express";
import { createUser, getUsers, getUser, removeUser, updateUser, checkAuth, changePassword } from "../services/user";
import { getMajor, getMajors } from "../services/major";
import { LoginDto } from "../types/user";

const index = async (req: Request, res: Response) => {
    try {
        // Assuming you might want to list users here later
        const users = await getUsers();
        res.render("users/index", {
            users,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};
    
const create = async (req: Request, res: Response) => {
    if (req.method === "GET") {
        try {
            const users = await getUsers(); 
            const majors = await getMajors(); 
            res.render("users/create", {
                users, 
                majors
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    } else if (req.method === "POST") {
        try {
            const user = req.body;
            await createUser(user);
            res.redirect("/users"); 
        } catch (err) {
            console.error(err);
            res.status(500).send(err); 
        }
    }
};

const read = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const user = await getUser(id)
        const major = user?.majorId ? await getMajor(user.majorId) : null;
        if (req.method === "GET"){
            res.render("users/read",{
                user,
                major
            })
        } 
    } catch(err){
        console.log(err)
    }
}


const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const user = await getUser(id)
        const majors = await getMajors();
        if (req.method === "GET"){
            res.render("users/create", {
                user,
                majors
            })
        } else if (req.method === "POST"){
            const new_user = req.body;
            await updateUser(id, new_user)
            console.log(new_user)
            res.redirect("/")
        }
    } catch(err){
        console.log(err)
    }
}

const remove = async (req: Request, res: Response) => {
    const {id} = req.params
    try{
        const user = await removeUser(id)
        res.status(200).send({ msg:`user deletado ${user}` })
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

const login = async (req: Request, res: Response) => {
    if (req.method === "GET") {
        res.render('users/login')
    } else {
        const {email, password} = req.body as LoginDto
        const user = await checkAuth(email, password)
        if (!user){
            res.render('users/login', {
                error: "Email ou senha inválidos."
            })
            return;
        } else{
            req.session.logado = true;
            req.session.userId = user.id; 
            req.session.save(() => {
                res.redirect('/');
            });
        }
    }
}

const logout = async (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
}

const renderUpdatePageWithError = async (res: Response, userId: string, errors: object = {}) => {
    try {
        const user = await getUser(userId);
        if (!user) {
            return res.redirect('/users/login');
        }

        const majors = await getMajors();
        const majorsSelection = majors.map(major => ({
            ...major,
            selected: major.id === user.majorId,
        }));

        res.render("users/update", { user, majors: majorsSelection, errors });
    } catch (error) {
        console.error("Error during renderUpdatePageWithError:", error);
        res.status(500).send("Erro ao carregar a página de perfil.");
    }
};


export const renderUpdatePage = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/users/login');
        }
        await renderUpdatePageWithError(res, userId);
    } catch (error) {
        console.error("Error rendering update page:", error);
        res.status(500).send("Erro ao carregar a página de perfil.");
    }
};

export const updateProfileData = async (req: Request, res: Response) => {
    const { userId } = req.session;
    if (!userId) {
        return res.redirect('/users/login');
    }

    try {
        const new_user = req.body;
        await updateUser(userId, new_user);
        req.flash('success_msg', 'Dados atualizados com sucesso!');
        res.redirect('/users/profile');
    } catch (error) {
        console.error("Error updating profile data:", error);
        await renderUpdatePageWithError(res, userId, { general: "Erro ao atualizar os dados do perfil." });
    }
};

/**
 * Handles the form submission to change a user's password.
 */
export const updatePass = async (req: Request, res: Response) => {
    const { userId } = req.session;
    if (!userId) {
        return res.redirect("/users/login");
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        if (newPassword !== confirmPassword) {
            return await renderUpdatePageWithError(res, userId, { confirmPassword: "A nova senha e a confirmação não coincidem." });
        }
        
        const result = await changePassword(userId, currentPassword, newPassword);

        if (!result.success) {
            return await renderUpdatePageWithError(res, userId);
        }

        req.flash('success_msg', 'Senha alterada com sucesso!');
        res.redirect("/users/profile");

    } catch (error) {
        console.error("Erro ao atualizar a senha:", error);
        await renderUpdatePageWithError(res, userId, { general: "Ocorreu um erro inesperado ao tentar atualizar a senha." });
    }
};


export default { index, create, read, update, remove, login, logout, renderUpdatePage, updatePass, updateProfileData }
