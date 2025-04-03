import { GenerateContentCandidate, GoogleGenerativeAI } from "@google/generative-ai";
import mime from "mime-types";
import { AxiosError } from "axios";
import fs from "node:fs";

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const checkGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseModalities: [],
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            is_true: {
                type: "boolean"
            }
        }
    },
};

async function checkWord(word: string, language: string) {
    // @ts-ignore
    const chatSession = model.startChat({ generationConfig: checkGenerationConfig });

    const result = await chatSession.sendMessage(`is '${word}' a word in ${language} dictionary`);

    const candidates = result.response.candidates as GenerateContentCandidate[];

    for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
        for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
            const part = candidates[candidate_index].content.parts[part_index];
            if(part.inlineData) {
                try {
                    const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
                    fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
                    console.log(`Output written to: ${filename}`);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
    return result.response.text();
}

export async function POST(req: Request) {
    try {
        const body: { word: string, language: string} = await req.json()
        const response = await checkWord(body.word, body.language)

        return Response.json({ body: JSON.parse(response) })
    } catch (error) {
        return Response.json({ error: (error as AxiosError).message }, { status: 500 });
    }
}
