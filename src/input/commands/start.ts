import CommandInterface from "@/lib/interfaces/command-interface";
import Client from "@/lib/client/client";
import { Context } from "telegraf";

export default {
    isDisabled: false,
    accessRole: "USER",
    async callback(ctx: Context, client: Client, options: any): Promise<void> {
        await ctx.telegram.sendChatAction(ctx.chat!.id, "typing")
        const user = await client.db?.user.findUnique({
            where: {
                id: ctx.from!.id
            }
        })
        if (!user){
            await client.db?.user.create({
                data: {
                    id: ctx.from!.id
                }
            })
        }
        await ctx.reply("Привет! Выбери команду ниже 😊", {
            reply_markup: {
                keyboard: client.keyboards.default,
                one_time_keyboard: true,
            },
            parse_mode: "Markdown",
        })
    }
} as CommandInterface