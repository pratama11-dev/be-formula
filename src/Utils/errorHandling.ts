import { Response } from 'express';


export const jsonErrorHandler = (err, req, res, next) => {
    res.status(500).send({ error: err });
}
export function defaultErrorHandling(res: Response, error) {
    return res.status(400).json({
        code: 400,
        info: error?.response?.message ?? error?.message ?? "something went wrong!",
        error: error
    })
}

export function ApiFormat(code: number, info: string, data: any) {
    return { code, info, data };
}

export function rejectNull(str: any, label: string, res: Response) {
    const message = `${label} cannot be empty`;

    if (typeof str === "undefined") {
        throw new Error(message);
    }
    if (str == null) {
        throw new Error(message);
    }
}