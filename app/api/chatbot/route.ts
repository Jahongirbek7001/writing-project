import OpenAI from "openai";
import { NextResponse } from "next/server";

const essayStructure = [
    {
        id: 1,
        name: 'Problem & Solution',
        structure: `
            1.Introduction
                -Topic paraphrase
                -Author's point
            2.Body-1(Problems)
                -Topic sentence
                -Problem-1 -> Reason/Example/Detail
                -Problem-2 -> Reason/Example/Detail
                -Problem-3 (optional) -> Reason/Example/Detail
            2.Body-2(Solutions)
                -Topic sentence
                -Solution-1 -> Reason/Example/Detail
                -Solution-2 -> Reason/Example/Detail
                -Solution-3 (optional) -> Reason/Example/Detail
            4.Conclusion
                -In concusion/ To conclude, Topic paraphrase
                -Author's point
        `
    },
    {
        id: 2,
        name: 'Advantage & Disadvantage',
        structure: `
            1.Introduction
                -Topic paraphrase
                -Author's point
            2.Body-1(Opposite side)
                -Topic sentence
                -Argument-1 -> Reason/Example/Detail
                -Argument-2 -> Reason/Example/Detail
                -Argument-3 (optional) -> Reason/Example/Detail
            2.Body-2(Author's side)
                -Topic sentence
                -Argument-1 -> Reason/Example/Detail
                -Argument-2 -> Reason/Example/Detail
                -Argument-3 (optional) -> Reason/Example/Detail
            4.Conclusion
                -In concusion/ To conclude, Topic paraphrase
                -Author's point
        `
    }
]

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error("OPENAI_API_KEY mavjud emas. .env faylini tekshiring.");
}

const openai = new OpenAI({ apiKey });

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: `Berilgan essayni grammatik jihatdan tekshir va quyidagi JSON formatda qaytar.
                    Quyidagi essay strukturasi 4 ta paragraphdan iborat va har bir paragraph joy tashlab ajratilgan bo'ladi. Agar strukturada xatolik bo'lsa xatolik haqida xabar ber.
                    {{
                      "status": "correct" yoki "incorrect" yoki "finally",
                      "errors": [
                        {{
                          "incorrect": "Xato gaplar bu yerda bo'lishi kerak",
                          "corrected": "Xato gaplarni to'g'irlangan varianti bu yerda bo'lishi kerak",
                        }}
                      ],
                      "finally": [
                         {{
                            "correctEssay": "Oxirida to'g'irlangan essayni chiqarib ber."
                         }}
                      ]
                    }}
                    Essay: ${message}`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const reply = response.choices[0]?.message?.content || "{}";
        return NextResponse.json(JSON.parse(reply));
    } catch (error: any) {
        console.error("Xatolik:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


