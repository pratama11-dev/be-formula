import { Request, Response } from "express";
import { defaultErrorHandling } from "../../Utils/errorHandling";


export const getSessions = async (req: Request, res: Response) => {
    const data = await req.prisma.user.findUnique({
        where: {
            id: req.user.id,
        },
        select: {
            user_role: true
        },
    });
    const type =
        req.user.password === "oauth by google" ? "Google" : "Email-Password";
    if (req.user.refresh_token) delete req.user.refresh_token;
    if (req.user.token) delete req.user.token;
    if (req.user.password) delete req.user.password;
    if (req.user.code) delete req.user.code;
    
    res.json({
        user: req.user,
        type,
        data,
    });
};

export const getListUser = async (req: Request, res: Response) => {
    try {
        const data = await req.prisma.user.findMany({})

        return res.status(200).json({
            data: data
        })
    } catch (error) {
        return defaultErrorHandling(res, error);
    }
}