"use client";
import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";

interface ChatSession {
  id: string;
  user_id: string;
  user_name: string;
  user_photo_url: string;
  last_message: string;
  last_sender_role: string;
  unread_admin: number;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_role: string;
  message: string;
  created_at: string;
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSessions = async () => {
    try {
      const res = await api.get<ChatSession[]>("/chat/sessions");
      setSessions(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await api.get<ChatMessage[]>(`/chat/admin/messages/${userId}`);
      setMessages(res.data);
      scrollToBottom();
      // Update session to mark as read
      setSessions(prev => prev.map(s => s.user_id === userId ? { ...s, unread_admin: 0 } : s));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => {
      fetchSessions();
      if (activeSession) {
        fetchMessages(activeSession.user_id);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSession]);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession.user_id);
    }
  }, [activeSession]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeSession) return;

    const text = newMessage.trim();
    setNewMessage("");

    // Optimistic UI
    const tempMessage: ChatMessage = {
      id: Date.now().toString(),
      sender_id: "admin",
      sender_role: "admin",
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMessage]);
    scrollToBottom();

    try {
      await api.post(`/chat/admin/messages/${activeSession.user_id}`, { message: text });
      fetchMessages(activeSession.user_id);
      fetchSessions();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] p-6">
      <div className="glass h-full rounded-2xl border border-white/5 flex overflow-hidden">
        {/* Sidebar Sessions */}
        <div className="w-1/3 border-r border-[#27272a] flex flex-col bg-[#141417]">
          <div className="p-4 border-b border-[#27272a]">
            <h2 className="text-lg font-bold text-white">Percakapan</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-slate-500 text-center py-8">Memuat obrolan...</p>
            ) : sessions.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Belum ada obrolan</p>
            ) : (
              sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => setActiveSession(session)}
                  className={`p-4 border-b border-[#27272a]/50 cursor-pointer transition-colors ${
                    activeSession?.id === session.id ? "bg-indigo-500/10" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {session.user_photo_url ? (
                        <img src={session.user_photo_url} alt={session.user_name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                          {session.user_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {session.unread_admin > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold border-2 border-[#141417]">
                          {session.unread_admin}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={`text-sm truncate ${session.unread_admin > 0 ? 'font-bold text-white' : 'font-medium text-slate-200'}`}>
                          {session.user_name}
                        </h4>
                        <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                          {new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${session.unread_admin > 0 ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                        {session.last_sender_role === 'admin' ? 'Anda: ' : ''}{session.last_message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col bg-[#111113]">
          {activeSession ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#27272a] bg-[#141417] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  {activeSession.user_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-medium leading-none mb-1">{activeSession.user_name}</h3>
                  <span className="text-xs text-slate-400">Warga</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, idx) => {
                  const isAdmin = msg.sender_role === 'admin';
                  return (
                    <div key={msg.id || idx} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-end gap-2 max-w-[80%]">
                        {!isAdmin && (
                          <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex shrink-0 items-center justify-center text-indigo-400 text-[10px] font-bold mb-1">
                            {activeSession.user_name.charAt(0)}
                          </div>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl ${
                            isAdmin
                              ? 'bg-indigo-600 text-white rounded-br-sm'
                              : 'bg-[#1e1e24] text-slate-200 border border-[#27272a] rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 mx-8">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-[#141417] border-t border-[#27272a]">
                <form onSubmit={handleSend} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tulis balasan..."
                    className="flex-1 bg-[#1e1e24] border border-[#27272a] rounded-xl px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Pilih percakapan untuk mulai merespon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
