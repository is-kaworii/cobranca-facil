import { EmbedBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { client } from "../..";
import { ModelMember } from "../../models/member.model";
import { ModelPayment } from "../../models/payment.model";
import { ModelProduct } from "../../models/product.model";

export async function approvedPayment(payment: PaymentResponse) {
  try {
    const guildId = payment.metadata.guild_id;
    const guild = client.guilds.resolve(guildId);
    const channel = guild.channels.cache.get(payment.metadata.channel_id) as TextChannel;

    const productDb = await ModelProduct.findOne({ id: payment.id });
    const memberDb = await ModelMember.findOne({ memberId: payment.metadata.member_id });
    const paymentDb = await ModelPayment.findOne({ id: payment.id });

    if (!productDb || !memberDb || !paymentDb) return;

    const products: [{ id: string; name: string; quant: number }] =
      payment.metadata.products;

    memberDb?.subscriptions?.push(payment.id!);
    paymentDb!.expiraction_date = ajustarDiaProximoMes(new Date()).toISOString();

    for (let i = 0; i < products.length; i++) {
      const product = await ModelProduct.findOne({
        id: products[i].id,
      });

      if (product) {
        product.roles.forEach((roleId) => {
          const role = guild.roles.resolve(roleId);
          const member = guild.members.resolve(payment.metadata.member_id);
          if (role) {
            member.roles.add(role);
          }
        });
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("PAGAMENTO APROVADO")
      .setDescription(
        "Pagamento foi aprovado e seu acesso aos canais serão liberados.\nAgradecemos pela compra."
      )
      .setTimestamp(new Date())
      .setColor(0x00ff00);

    await channel.send({ embeds: [embed] });
    await memberDb.save();
    await paymentDb.save();

    setTimeout(async () => {
      await channel?.delete();
    }, 30 * 60 * 1000);
  } catch (error) {
    console.error("Error updating payment status:", error);
  }
}

function ajustarDiaProximoMes(data: Date) {
  const ano = data.getFullYear();
  const mes = data.getMonth();
  const dia = data.getDate();

  // Calcula o próximo mês e ano, já considerando o caso de dezembro
  const proximoMes = (mes + 1) % 12;
  const proximoAno = mes === 11 ? ano + 1 : ano;

  // Cria uma data temporária com o mesmo dia no próximo mês
  const novaData = new Date(proximoAno, proximoMes, dia);

  // Verifica se o dia foi ajustado para o mês seguinte
  // (ex: 31 de março viraria 3 de abril)
  if (novaData.getDate() !== dia) {
    // Se o dia foi ajustado, significa que o próximo mês
    // não tem o mesmo dia, então volta para o último dia do mês atual
    novaData.setDate(0); // Definir o dia como 0 retorna ao último dia do mês anterior
  }

  return novaData;
}
