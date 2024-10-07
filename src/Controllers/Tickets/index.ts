import { Request, Response } from "express";
import { defaultErrorHandling } from "../../Utils/errorHandling";
import { string, z } from "zod";
import { ZodSchema } from "../../zSchema";
import { DateUtil } from "../../Utils/dateUtils";
import moment from "moment";
import { zeroPad } from "../../Utils/stringUtil";
import { savePhotoAttachment } from "../../Utils/fsUtil";
import QRCode from "qrcode";

export const ticketList = async (req: Request, res: Response) => {
    try {
        const i = z.object({
            pagination: z.object({
                take: z.number().optional(),
                skip: z.number().optional(),
            }),
            search: z.string().optional(),
            id_event: z.number().optional().nullable()
        }).parse(req.body);

        const data = await req.prisma.tickets.findMany({
            take: i?.pagination?.take,
            skip: i?.pagination?.skip,
            where: {
                order_item: {
                    event: {
                        id: i.id_event
                    }
                }
            },
            include: {
                order_item: {
                    include: {
                        orders: true,
                        event: true
                    }
                },
            }
        })

        for (const d of data) {
            d.qr_code = await QRCode.toDataURL(
              `${d?.qr_code}`
            );
        }

        const count = await req.prisma.tickets.count({
            where: {
                order_item: {
                    event: {
                        id: i.id_event
                    }
                }
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

export const createTicket = async (req: Request, res: Response) => {
    try {
        const input = ZodSchema.ZAddTicket.parse(req.body);

        let user

        // find user
        const findUser = await req.prisma.user.findFirst({
            where: {
                no_document: input?.no_doc
            }
        })

        const bulan = moment().format("MM");
        const tanggal = moment().format("DD");

        if (!findUser) {
            user = await req.prisma.user.create({
                data: {
                    id_role: 2,
                    name: input?.name,
                    type_doc: input?.type_doc,
                    no_document: input?.no_doc
                }
            })
        } else {
            user = findUser
        }

        const arrTicket = []

        const findEvent = await req.prisma.event?.findFirstOrThrow({
            where: {
                id: input?.id_event
            }
        })

        const dataCreate = await req.prisma.orders.create({
            data: {
                id_user: user?.id,
                id_status: 1,
                total_amount: input?.ticketHolders?.length ?? 0,
                total_price: parseFloat(input?.price) * input?.ticketHolders?.length ?? 0,
                created_at: DateUtil?.CurDate(),
            }
        })

        for await (const loop of input?.ticketHolders) {
            const runningNumberFromDB = await req.prisma.tickets.findFirst({
                orderBy: {
                    id: "desc"
                }
            })

            let runningNumber = (runningNumberFromDB?.id ?? 0 + 1) ?? 1

            const qr_code = `${findEvent?.id}-${bulan}${tanggal}-${zeroPad(runningNumber, 4)}`

            const data = await req?.prisma?.tickets?.create({
                data: {
                    qr_code: qr_code,
                    is_active: 0,
                    price: input?.price,
                    ticket_owner: loop?.name,
                    type_doc: loop?.type_doc_type_holder,
                    doc_ticket_owner: loop?.no_doc,
                    order_item: {
                        create: {
                            id_order: dataCreate?.id,
                            id_event: findEvent?.id,
                            price: input?.price,
                            created_at: DateUtil?.CurDate(),
                            type_ticket: input?.type_ticket,
                        }
                    }
                }
            })

            arrTicket.push(data)
        }

        for await (const element of input?.attachment) {
            const path = await savePhotoAttachment(element?.upload)

            const data = await req.prisma.order_attachment?.create({
                data: {
                    id_order: dataCreate?.id,
                    file_attachment: path,
                    created_at: DateUtil?.CurDate()
                }
            })
        }

        return res.status(200).json({
            data: arrTicket,
        })
    } catch (error) {
        return defaultErrorHandling(res, error)
    }
}

export const deleteTicket = async (req: Request, res: Response) => {
    try {
        const i = z.object({
            id: z.number(),
            id_order_item: z.number()
        }).parse(req.body);

        const dataOrderItem = await req.prisma.order_item.delete({
            where: {
                id: i?.id_order_item
            }
        })
        
        const data = await req.prisma.tickets.delete({
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

export const listOrder = async (req: Request, res: Response) => {
    try {
        const i = z.object({
            pagination: z.object({
                take: z.number().optional(),
                skip: z.number().optional(),
            }),
            search: z.string().optional(),
            id_event: z.number().optional().nullable()
        }).parse(req.body);

        const data = await req.prisma.orders.findMany({
            take: i?.pagination?.take,
            skip: i?.pagination?.skip,
            where: {
                
            },
            include: {
                order_item: {
                    include: {
                        tickets: true,
                        event: true
                    }
                },
                order_status: true,
                user: true
            }
        })

        const count = await req.prisma.orders.count({})


        return res.status(200).json({
            data: data,
            total: count
        })
    } catch (error) {
        return defaultErrorHandling(res, error)
    }
}