import { Request, Response } from "express"
import { createMajor, getMajor, getMajors, removeMajor, updateMajor } from "../services/major"


const index = async (req: Request, res: Response) => {
    try{
        const majors = await getMajors();
        res.render("majors/index", {
            majors,
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
    
}


const create = async (req: Request, res: Response) => {
    if( req.method === "GET"){
        res.render("majors/create")
    } else if (req.method === "POST"){
        try{
            const major = req.body;
            await createMajor(major)
            res.redirect("/majors")
        } catch(err){
            console.log(err);
        }
        
    }
}


const read = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const major = await getMajor(id)
        if (req.method === "GET"){
            res.render(`majors/read`,{
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
        let major = await getMajor(id)
        if (req.method === "GET"){
            res.render("majors/create", {
                major
            })
        } else if (req.method === "POST"){
            const new_major = req.body;
            await updateMajor(id, new_major)
            console.log(new_major)
            res.redirect("/majors")
        }
    } catch(err){
        console.log(err)
    }
}

const remove = async (req: Request, res: Response) => {
    const {id} = req.params
    try{
        const major = await removeMajor(id)
        res.status(200).send({ msg:`curso deletado ${major}` })
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

export default { index, create, read, update, remove }
