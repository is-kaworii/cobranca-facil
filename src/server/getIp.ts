import axios from 'axios';

export async function getPublicIP(): Promise<string> {
  try {
    const reponse = await axios.get("https://api.ipify.org?format=json");
    return reponse.data.ip;
  } catch (error) {
    console.error("Erro ao obter o IP público:", error);
    throw error
  }
}