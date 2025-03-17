"use client";

import { useState } from "react";

export default function ChatComponent() {
    const [message, setMessage] = useState<string>("");
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {

            const res = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error("Error:", error);
            setResponse({ error: "Xatolik yuz berdi." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 w-full mx-auto">
            <h2 className="text-xl font-bold mb-4 text-black">Essay tekshiruvchi</h2>
            <div className="w-full flex justify-between items-start px-5">
                <form onSubmit={handleSubmit} className="mb-4 w-[45%] h-[400px] shadow-lg rounded-lg p-4 bg-white">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-[300px] resize-none p-3 rounded focus:ring-2 focus:ring-blue-400 text-black"
                        placeholder="Essay yozing..."
                        required
                        rows={5}
                    ></textarea>
                    <button
                        type="submit"
                        className="mt-2 w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Tekshirilmoqda..." : "Yuborish"}
                    </button>
                </form>

                <div className="w-[45%] h-[400px] overflow-auto shadow-lg rounded-lg p-4 bg-white">
                    {response && (
                        <div className="p-4 bg-gray-100 rounded-lg text-black">
                            <strong>Natija:</strong>
                            {response.status === "correct" ? (
                                <p className="text-green-600 mt-2">Essay to‘g‘ri yozilgan!</p>
                            ) : (
                                <div className="mt-2">
                                    {response.errors?.map((error: any, index: number) => (
                                        <div key={index} className="mt-2">
                                            <p className="text-red-600">
                                                <strong>Xato:</strong> {error.incorrect}
                                            </p>
                                            <p className="text-green-600">
                                                <strong>To‘g‘rilangan:</strong> {error.corrected}
                                            </p>
                                        </div>
                                    ))}
                                    {response.finally?.map((i: any, index: number) => (
                                        <div key={index}>
                                            <strong>To‘g‘rilangan essay:</strong>
                                            <p className="text-black">
                                                {i.correctEssay}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
