import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Salva uma nova sessão de jogo (score) para um usuário.
 * @param userId O ID do usuário que jogou.
 * @param score A pontuação final do jogo.
 * @returns A sessão de jogo criada.
 */
export const saveGameScore = async (userId: string, score: number) : Promise<{id:string, userId:string, score:number}> => {
    return await prisma.session.create({ data: { userId, score }});
};

/**
 * Busca os maiores scores para o leaderboard.
 * @param limit O número de scores a serem retornados (padrão: 10).
 * @returns Uma lista dos maiores scores com os nomes dos jogadores.
 */
export const getLeaderboard = async (limit: number = 10) => {
    // Etapa 1: Encontrar a pontuação máxima para cada usuário distinto.
    const topScoresByUser = await prisma.session.groupBy({
        by: ['userId'],
        _max: {
            score: true,
        },
        orderBy: {
            _max: {
                score: 'desc',
            },
        },
        take: limit,
    });

    // Se não houver pontuações, retorna um array vazio.
    if (topScoresByUser.length === 0) {
        return [];
    }

    // Etapa 2: Buscar os nomes dos usuários correspondentes a essas pontuações.
    const userIds = topScoresByUser.map(s => s.userId);
    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true },
    });

    // Mapeia os usuários por ID para facilitar a busca.
    const userMap = new Map(users.map(u => [u.id, u.name]));

    // Etapa 3: Combinar os dados para criar o ranking final.
    return topScoresByUser.map(scoreEntry => ({
        userName: userMap.get(scoreEntry.userId) || 'Jogador Desconhecido',
        score: scoreEntry._max.score ?? 0, // Usa ?? 0 para o caso de score ser null
    }));
};