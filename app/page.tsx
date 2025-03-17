import Link from "next/link";
import ChatComponent from "./components/Chat";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-200">
      <h1 className="text-3xl font-bold">ChatGPT Next.js</h1>
      <ChatComponent />
    </main>
  );
}