import InlineKeyboardInterface from "@/lib/interfaces/inline-keyboard-interface";
import { Context } from "telegraf";
import Client from "@/lib/client/client";

export default {
    isDisabled: false,
    async callback(ctx: Context, client: Client, options: string): Promise<void> {
        client.userCache.add(`${ctx.from!.id}`, {groupId: Number(options), label: "sending message", ready: false})
        await ctx.editMessageText("Отлично! Теперь отправь мне сообщение, которое нужно отправить \n\nподдерживаются простые сообщения и сообщения с Markdown")
    }
} as InlineKeyboardInterface