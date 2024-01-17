import KeyboardInteractionInterface from "@/lib/interfaces/command-interaction-interface";
import Client from "@/lib/client/client";
import { Context, Markup } from "telegraf";

export default {
    isDisabled: false,
    async callback(ctx: Context, client: Client): Promise<void> {
        await ctx.telegram.sendChatAction(ctx.chat!.id, "typing")
        let user = await client.db?.user.findUnique({
            where: {
                id: ctx.from!.id
            },
            include: {
                groups: true
            }
        })
        if (!user) user =  await client.db?.user.create({
            data: {
                id: ctx.from!.id
            },
            include: {
                groups: true
            }
        })
        if (!user?.groups || user?.groups.length === 0) await ctx.reply("Ой 😧 \nПохоже у вас нет добавленных групп.\nДобавьте её по нажатию на кнопку ниже😊",
            Markup.inlineKeyboard([[{text: "Добавить группу", callback_data: "add-group"}]]))
        else {
            let keyboard = []
            for (let group of user.groups) {
                keyboard.push([{text: group.title, callback_data: `pick-group|${group.id}`}])
            }
            keyboard.push([{text: "Добавить группу", callback_data: "add-group"}])
            await ctx.reply("Выбери группу в которую хочешь отправить сообщение с кнопкой-ссылкой", {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            })
        }
    }
} as KeyboardInteractionInterface