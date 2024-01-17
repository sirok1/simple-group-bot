import InlineKeyboardInterface from "@/lib/interfaces/inline-keyboard-interface";
import { Context } from "telegraf";
import Client from "@/lib/client/client";

export default {
    isDisabled: false,
    async callback(ctx: Context, client: Client, options: string): Promise<void> {
        await ctx.editMessageText("Для добавления группы просто добавьте меня туда")
        client.userCache.add(`${ctx.from!.id}`, {callback_data: "add-group"})
    }
} as InlineKeyboardInterface