'use client'
import useChat from '@/utils/useChat'
import Image from 'next/image'
export default function Home() {
  const { messages, input, setInput, sendMessage, loading } = useChat()
  return (
    <div className="w-full h-full flex flex-col p-8 max-sm:p-4 text-base">
      <main className="flex-1 no-scrollbar-y">
        {messages.length === 0 && (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <div className="w-10 h-10 mx-auto rounded-md bg-[#00CB7F] flex justify-center items-center text-white">
              <Image alt="ChatGPT" src="/chatgpt.png" width={20} height={20} />
            </div>
            <div className="my-4">Do you have any questions?</div>
          </div>
        )}
        <div className="text-sm leading-6 font-medium">
          {messages.map((msg, index) => (
            <div className="mb-10" key={index}>
              <div className="flex items-center my-5">
                {msg.role === 'user' ? (
                  <div className="w-10 h-10 rounded-full bg-[#FFBF00] flex justify-center items-center text-white">
                    CH
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#00CB7F] flex justify-center items-center text-white">
                    <Image
                      alt="ChatGPT"
                      src="/chatgpt.png"
                      width={20}
                      height={20}
                    />
                  </div>
                )}
                <div className="font-semibold mx-4">{msg.role}</div>
              </div>
              {/* 内容 */}
              <div className="text-sm leading-6 font-medium px-14 max-sm:px-2 text-justify">
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="h-10 leading-10 font-semibold mx-14 max-sm:mx-2">
              Loading...
            </div>
          )}
        </div>
      </main>
      <footer className="h-12 flex justify-between px-3 items-center border border-gray-200 rounded-lg">
        <input
          className="w-full border-none bg-transparent focus:border-none focus:outline-none focus:ring-0 focus:shadow-none text-sm"
          placeholder="Message ChatGPT..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              sendMessage(input)
            }
          }}
        />
        <div
          onClick={() => {
            if (input.trim()) {
              sendMessage(input)
            }
          }}
          className="bg-[#E5E5E5] cursor-pointer w-8 h-8 rounded-lg flex justify-center items-center ml-2"
        >
          <Image
            alt="send info"
            src="/send-info.png"
            width={20}
            height={20}
            className="max-sm:w-4 max-sm:h-4"
          />
        </div>
      </footer>
    </div>
  )
}
