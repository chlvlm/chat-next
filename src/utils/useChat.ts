import { useState } from 'react'
// api key
const open_key =
  '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'

// 定义类型（聊天信息）
interface Message {
  role: 'user' | 'assistant'
  content: string
}

const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false) // 加载状态
  // 发送消息
  const sendMessage = async (message: string) => {
    const newMessage: Message = { role: 'user', content: message }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${open_key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',
            messages: [...messages, newMessage],
            stream: true,
          }),
        }
      )
      if (!response.body) return
      // 获取响应体的流读取器，逐块读取数据
      const reader = response.body.getReader()
      // 将字节流解码为文本
      const decoder = new TextDecoder()
      let partialMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter((line) => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            // 删除“数据：”前缀
            const json = line.substring(6)
            // 处理流结束
            if (json === '[DONE]') return
            try {
              const parsed = JSON.parse(json)
              const delta = parsed.choices[0].delta
              if (delta.content) {
                partialMessage += delta.content
                setMessages((prevMessages) => {
                  const updatedMessages: Message[] = [...prevMessages]
                  if (
                    updatedMessages[updatedMessages.length - 1].role ===
                    'assistant'
                  ) {
                    updatedMessages[updatedMessages.length - 1].content =
                      partialMessage
                  } else {
                    updatedMessages.push({
                      role: 'assistant',
                      content: partialMessage,
                    })
                  }
                  return updatedMessages
                })
              }
              setLoading(false)
            } catch (error) {
              setLoading(false)
              console.error('Error parsing JSON', error)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error calling OpenRouter API', error)
    }
  }

  return {
    messages,
    input,
    setInput,
    sendMessage,
    loading,
  }
}

export default useChat
