import { Request, Response } from "express";
import { LoremIpsum } from "lorem-ipsum";
import path from "path";

const main = (req: Request, res: Response) => {
    // Renderiza a página principal de boas-vindas
    res.render("index");
};

const greetings = (req: Request, res: Response) => {
    res.status(200).send(`Bem-vindo(a) ${req.params.nome}!`);
};

const game = (req: Request, res: Response) => {

    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
};

const about = (req: Request, res: Response) => {
    res.render("about", {
        title: "about the game",
        description: "Embarque em uma jornada pelo cosmos. Como uma estrela cadente, sua missão é desviar de asteroides e enfrentar naves inimigas. Você consegue compor a sinfonia perfeita e alcançar a maior pontuação?",
        controls: [
            { key: "Atirar", action: "Barra de Espaço" },
            { key: "Movimentar", action: "Setas Direcionais" }
        ]
    });
};


const hb1 = (req: Request, res: Response) => {
    res.render("hb1", {
        mensagem: "Olá, você está aprendendo Express + HBS!",
        layout: false
    })
}

const hb2 = (req: Request, res: Response) => {
    res.render("hb2", {
        mensagem: "Express Framework",
        layout: false
    })
}

const hb3 = (req: Request, res: Response) => {
    const profes = [
        { nome: 'David Fernandes', sala: 1238 },
        { nome: 'Horácio Fernandes', sala: 1233 },
        { nome: 'Edleno Moura', sala: 1236 },
        { nome: 'Elaine Harada', sala: 1231 }
    ];
    res.render('hb3', { profes, layout: false });
}

const hb4 = (req: Request, res: Response) => {
        const technologies = [
            { name: 'Express', type: 'Framework', poweredByNodejs: true },
            { name: 'Laravel', type: 'Framework', poweredByNodejs: false },
            { name: 'React', type: 'Library', poweredByNodejs: true },
            { name: 'Handlebars', type: 'Engine View', poweredByNodejs: true },
            { name: 'Django', type: 'Framework', poweredByNodejs: false },
            { name: 'Docker', type: 'Virtualization', poweredByNodejs: false },
            { name: 'Sequelize', type: 'ORM tool', poweredByNodejs: true },
        ];

        res.render('hb4', { technologies , layout:false})
}



const lorem = (req: Request, res: Response) =>{
    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4
        },
        wordsPerSentence: {
            max: 16,
            min: 4
        }
    });

    res.status(200).send(`${lorem.generateParagraphs(4)}`)
}

const testeCookie = (req : Request, res: Response) =>{
    if(!('teste-cookie' in req.cookies)){
        res.cookie('teste-cookie', 'algum-valor')
        res.send("voce nunca passou aqui")
    } else{
        res.send("voce já passou por aqui")
    }
}

export default { main, greetings, about, lorem, hb1, hb2, hb3, hb4, testeCookie, game }