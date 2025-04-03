import { GenerateContentCandidate, GoogleGenerativeAI } from "@google/generative-ai";
import mime from "mime-types";
import { AxiosError } from "axios";
import fs from "node:fs";

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfigDefinition = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseModalities: [],
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            word: {
                type: "string"
            },
            language: {
                type: "string"
            },
            definition: {
                type: "string"
            },
            example: {
                type: "string"
            },
            partsOfSpeech: {
                type: "string"
            }
        },
        required: [
            "word",
            "language",
            "definition",
            "example",
            "partsOfSpeech"
        ]
    },
};

async function defineWord(word: string, language: string, otherLanguage: string) {
    // @ts-ignore
    const chatSession = model.startChat({ generationConfig: generationConfigDefinition });

    const result = await chatSession.sendMessage(`${word} is a ${language} word. Define it for a ${otherLanguage} person.`);

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
        const body: { word: string, language: string, otherLanguage: string } = await req.json()
        const response = await defineWord(body.word, body.language, body.otherLanguage)

        return Response.json({ body: JSON.parse(response) })
    } catch (error) {
        return Response.json({ error: (error as AxiosError).message }, { status: 500 });
    }
}
