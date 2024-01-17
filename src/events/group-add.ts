import Client from "@/lib/client/client";

export default function (client: Client) {
    client.bot?.on("my_chat_member", async ctx => {
        const isExist = await client.db?.group.findUnique({
            where: {
                id: ctx.update.my_chat_member.chat.id,
                userId: ctx.update.my_chat_member.from.id
            }
        })
        if (ctx.update.my_chat_member.new_chat_member.status !== "left") {
            if (!isExist) {
                await client.db?.group.create({
                    data: {
                        userId: ctx.update.my_chat_member.from.id,
                        id: ctx.update.my_chat_member.chat.id,
                        //@ts-ignore
                        title: String(ctx.update.my_chat_member.chat.title)
                    }
                })
            }
            client.emit("userGroupInvite", {
                chat: ctx.update.my_chat_member.chat,
                user: ctx.update.my_chat_member.from.id,
                ctx: ctx
            })
        } else {
            if (isExist) {
                await client.db?.group.delete({
                    where: {
                        userId: ctx.update.my_chat_member.from.id,
                        id: ctx.update.my_chat_member.chat.id
                    }
                })
                client.emit("userGroupRemove", {
                    chat: ctx.update.my_chat_member.chat,
                    user: ctx.update.my_chat_member.from.id,
                    ctx: ctx
                })
            }
        }
    })

    client.on("userGroupInvite", async ({chat, user, ctx}) => {
        ctx.telegram.sendMessage(user, `Группа *"${chat.title}"* успешно добавлена`,{
            reply_markup: {
                inline_keyboard: [[{text: "Отправить сообщение с ссылкой", callback_data: "message-link"}]]
            },
            parse_mode: "Markdown"
        })
    })


    client.on("userGroupRemove", async ({chat, user, ctx}) => {
        ctx.telegram.sendMessage(user, `Группа *"${chat.title}"* успешно удалена`, {parse_mode: "Markdown"})
    })
}