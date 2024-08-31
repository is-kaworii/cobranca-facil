import { EmbedBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  TextChannel,
} from "discord.js";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { client, logger } from "../..";
import { ModelMember } from "../../models/member.model";
import { ModelPayment } from "../../models/payment.model";
import { ModelProduct } from "../../models/product.model";

export async function approvedPayment(payment: PaymentResponse) {
  logger.info("Starting approved payment");
  try {
    console.log(payment.metadata);
    const guild = client.guilds.resolve(payment.metadata.guild_id);
    const channel = guild.channels.cache.get(payment.metadata.channel_id) as TextChannel;
    const member = guild.members.resolve(payment.metadata.member_id);

    const memberDb = await createMemberInDatabase(member);
    const paymentDb = await ModelPayment.findOne({ id: payment.id }).catch(console.error);

    if (!memberDb || !paymentDb)
      throw new Error("productDb or memberDb or paymentDb not found");

    const products: [{ id: string; name: string; quant: number }] =
      payment.metadata.products;

    memberDb?.subscriptions?.push(payment.id!);
    paymentDb!.expiraction_date = ajustarDiaProximoMes(new Date()).toISOString();

    for (let i = 0; i < products.length; i++) {
      const productDb = await ModelProduct.findOne({
        id: products[i].id,
      });

      if (productDb) {
        productDb.roles.forEach((roleId) => {
          const role = guild.roles.resolve(roleId);
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

    const closeButton = new ButtonBuilder()
      .setCustomId("productCancelCartButton")
      .setLabel("Fechar")
      .setStyle(ButtonStyle.Success)
      .setEmoji("😀");
    const row: any = new ActionRowBuilder().addComponents(closeButton);

    await channel.send({ embeds: [embed], components: [row] });
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

async function createMemberInDatabase(member: GuildMember) {
  try {
    const memberDb = await ModelMember.findOne({ memberId: member.user.id });
    if (memberDb) return memberDb;

    const newMember = new ModelMember({
      memberId: member.user.id,
      globalName: member.user.globalName,
      username: member.user.username,
      subscriptions: [],
    });

    await newMember.save();
    return newMember;
  } catch (error) {
    logger.error("Error getting or creating member in database", error);
  }
}
