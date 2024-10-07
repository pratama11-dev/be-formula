import { Request, Response } from 'express';
import { defaultErrorHandling } from '../../Utils/errorHandling';
import { z } from 'zod';
import { ZodSchema } from '../../zSchema';
import moment from 'moment';

export const ListEvent = async (req: Request, res: Response) => {
    try {
        const i = z.object({
            pagination: z.object({
                take: z.number().optional(),
                skip: z.number().optional(),
            }),
            search: z.string().optional(),
        }).parse(req.body);

        const data = await req.prisma.event.findMany({
            take: i?.pagination?.take,
            skip: i?.pagination?.skip,
            where: {
                AND: [
                    i.search ? {
                        name: {
                            contains: i.search
                        }
                    } : undefined
                ]
            },
            include: {
                event_status: true,
                order_item: true
            },
            orderBy: {
                event_date: "asc"
            }
        })

        const count = await req.prisma.event.count({
            where: {
                AND: [
                    i.search ? {
                        name: {
                            contains: i.search
                        }
                    } : undefined
                ]
            }
        })

        return res.status(200).json({
            data: data,
            total: count
        })
    } catch (error) {
        return defaultErrorHandling(res, error)
    }
}

export const CreateEvent = async (req: Request, res: Response) => {
    try {
        const input = ZodSchema.ZAddEvent.parse(req.body);

        const data = await req.prisma.event.create({
            data: {
                id_status: 2,
                name: input?.name,
                event_date: moment(input?.event_date).toISOString(),
            }
        })

        return res.status(200).json({
            data: data,
        })
    } catch (error) {
        return defaultErrorHandling(res, error)
    }
}

export const UpdateEvent = async (req: Request, res: Response) => {
    try {
        const input = ZodSchema.ZEditEvent.parse(req.body);

        const data = await req.prisma.event.update({
            where:{
                id: input?.id_event
            },
            data: {
                id_status: input?.id_status,
                name: input?.name,
                event_date: moment(input?.event_date).toISOString(),
            }
        })

        return res.status(200).json({
            data: data,
        })
    } catch (error) {
        return defaultErrorHandling(res, error)
    }
}

export const DeleteEvent = async (req: Request, res: Response) => {
    try {
        const i = z.object({
            id: z.number()
        }).parse(req.body);


        const data = await req.prisma.event.delete({
            where: {
                id: i?.id
            }
        })

        return res.status(200).json({
            data: data,
        })
    } catch (error) {
        return defaultErrorHandling(res, error)
    }
}