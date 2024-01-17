import Client from "@/lib/client/client";
import { message } from "telegraf/filters";

export default function (client:Client) {
    client.bot?.on(message("text"), async ctx => {
        const cacheData = client.userCache.get(`${ctx.from.id}`)
        if(cacheData && cacheData.label == "sending message"){
            client.userCache.add(`${ctx.from.id}`, Object.assign({}, cacheData, {message: ctx.update.message, label: "sending link"}))
            await ctx.reply("Отлично, записал 📝\n\n Теперь отправьте ссылку которую необходимо прикрепить к сообщению")
        }
        else if(cacheData && cacheData.label === "sending link"){
            if (!ctx.message.text.startsWith("https://")) return await ctx.reply("Ссылка должна начинаться с https:// 🤓")
            client.userCache.add(`${ctx.from.id}`, Object.assign({}, cacheData, {link: ctx.message.text, label: "sending link name"}))
            await ctx.reply("Хорошо. Теперь отправьте текст кнопки-ссылки")
        }
        else if(cacheData && cacheData.label === "sending link name"){
            if (ctx.message.text.length > 30) return await ctx.reply("Текст должен быть короче")
            await ctx.reply("Прекрасно, отправляю сообщение в указанный канал...")
            await ctx.telegram.sendChatAction(ctx.chat.id, "typing")
            await ctx.telegram.sendMessage(Number(cacheData.groupId), `${cacheData.message.text}`, {
                reply_markup: {
                    inline_keyboard: [[{text: ctx.message.text, url: cacheData.link}]]
                },
                parse_mode: "Markdown"
            })
            await ctx.reply("Сообщение успешно отправлено 🥳", {
                reply_markup: {
                    inline_keyboard: [[{text: "Отправить ещё одно сообщение с ссылкой", callback_data: "message-link"}]]
                }
            })
            // if (cacheData.message.photo) {
            //     await ctx.telegram.sendMediaGroup(Number(cacheData.groupId), [Object.assign({}, cacheData.message.photo.shift, {caption: cacheData.message.caption}), ...cacheData.message.photo], {
            //
            //     })
            // }

        }
    })

    // client.bot?.on(message("caption"), async ctx => {
    //     const cacheData = client.userCache.get(`${ctx.from.id}`)
    //     if(cacheData && cacheData.label == "sending message"){
    //         client.userCache.add(`${ctx.from.id}`, Object.assign({}, cacheData, {message: ctx.update.message, label: "sending link"}))
    //         await ctx.reply("Отлично, записал 📝\n\n Теперь отправьте ссылку которую необходимо прикрепить к сообщению")
    //     }
    // })
}