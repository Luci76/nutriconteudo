
import { GoogleGenAI, Type } from "@google/genai";
import { PostInput } from "../types";

const SYSTEM_INSTRUCTION = `Você é o NutriConteúdo IA, um assistente especialista em marketing de conteúdo para nutricionistas que atuam no Instagram.
Sua função é gerar conteúdos prontos para postagem, com foco em: Engajamento, Autoridade profissional e Conversão para consultas.

REGRAS CRÍTICAS:
- Use linguagem clara, ética e profissional.
- JAMAIS faça promessas de cura.
- JAMAIS prescreva dietas específicas.
- NÃO utilize termos sensacionalistas (ex: "seque 10kg", "milagre", "veneno").
- Sempre incentive o acompanhamento profissional individualizado.
- O conteúdo deve ser humanizado e gerar conexão.

Você deve retornar obrigatoriamente um objeto JSON seguindo este esquema:
{
  "title": "Título chamativo e ético",
  "type": "Tipo do conteúdo",
  "structure": "Descrição detalhada dos slides (se carrossel) ou do visual (se reel/post)",
  "legend": "Legenda completa com emojis, parágrafos e tom solicitado",
  "cta": "Chamada para ação final"
}`;

export const generateNutriContent = async (input: PostInput): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Gere um conteúdo de Instagram com os seguintes parâmetros:
    - Nicho da Nutricionista: ${input.niche}
    - Público-alvo: ${input.targetAudience}
    - Objetivo do conteúdo: ${input.goal}
    - Tipo de conteúdo desejado: ${input.contentType}
    - Tom da comunicação: ${input.tone}

    Lembre-se de seguir rigorosamente as regras éticas e o formato de saída JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            type: { type: Type.STRING },
            structure: { type: Type.STRING },
            legend: { type: Type.STRING },
            cta: { type: Type.STRING },
          },
          required: ["title", "type", "structure", "legend", "cta"]
        }
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    throw error;
  }
};
