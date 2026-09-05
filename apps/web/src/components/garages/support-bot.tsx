import { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/common/modal';
import { Button } from '@/components/common/button';
import { Send, Bot, User, Loader2, Plus, Image as ImageIcon, Video, File, X, History, ChevronLeft } from 'lucide-react';
import { cn } from '@/utils/cn';
import { apiClient } from '@/lib/api-client';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
  isForm?: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
  created_at?: string;
}

interface SupportRequest {
  id: string;
  subject: string;
  category: string;
  description: string;
  status: string;
  attachment: string | null;
  conversation_id: string | null;
  created_at: string;
}

export function SupportBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversationId, setConversationId] = useState<string>('');

  // History state
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<SupportRequest[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<SupportRequest | null>(null);
  
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [loadMessagesError, setLoadMessagesError] = useState(false);

  // Attachment state
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{ file: globalThis.File, dataUrl: string, type: 'image' | 'video' | 'file' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showHistory, selectedHistory, historyMessages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as Node)) {
        setShowAttachMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveMessage = (sender: 'bot' | 'user', text: string, attachment?: string, currentConvId?: string) => {
    const cid = currentConvId || conversationId;
    if (!cid) return;
    apiClient.post('/users/support-messages', {
      conversationId: cid,
      sender,
      text,
      attachment
    }).catch(console.error);
  };

  // Reset chat when opened
  useEffect(() => {
    if (isOpen) {
      const newConvId = crypto.randomUUID();
      setConversationId(newConvId);
      
      const initText = "Hi! I'm WrectifAI Support. How can I help you today?";
      setMessages([
        {
          id: 'init',
          sender: 'bot',
          text: initText,
          options: [
            'Booking Issue',
            'Quote Issue',
            'Service Request',
            'Account Issue',
            'Payment Issue',
            'Technical Issue'
          ]
        }
      ]);
      saveMessage('bot', initText, undefined, newConvId);

      setInputValue('');
      setShowHistory(false);
      setSelectedHistory(null);
      setSelectedAttachment(null);
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setShowHistory(true);
    setSelectedHistory(null);
    setIsLoadingHistory(true);
    try {
      const res = await apiClient.get<SupportRequest[]>('/users/support-requests');
      setHistoryItems(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSelectHistory = async (item: SupportRequest) => {
    setSelectedHistory(item);
    if (item.conversation_id) {
      setIsLoadingMessages(true);
      setLoadMessagesError(false);
      try {
        const res = await apiClient.get<any[]>(`/users/support-messages/${item.conversation_id}`);
        const mapped = res.map(m => ({
          id: m.id,
          sender: m.sender as 'bot' | 'user',
          text: m.text,
          attachmentUrl: m.attachment,
          created_at: m.created_at
        }));
        setHistoryMessages(mapped);
      } catch (err) {
        console.error(err);
        setLoadMessagesError(true);
      } finally {
        setIsLoadingMessages(false);
      }
    } else {
      setHistoryMessages([]);
    }
  };

  const handleOptionClick = (option: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: option }]);
    saveMessage('user', option);

    let botResponse = '';
    let nextOptions: string[] | undefined = undefined;

    if (option === 'Booking Issue') {
      botResponse = "I can help with booking-related issues. What seems to be wrong?";
      nextOptions = ['Booking not showing', 'Unable to update booking', 'Customer issue', 'Other'];
    } else if (option === 'Quote Issue') {
      botResponse = "I can help with quote-related issues. What seems to be wrong?";
      nextOptions = ['Quote not sending', 'Quote missing fields', 'Cannot view quotes', 'Other'];
    } else if (option === 'Service Request') {
      botResponse = "I can help with service requests. What seems to be wrong?";
      nextOptions = ['Request missing', 'Cannot accept request', 'Other'];
    } else if (option === 'Account Issue') {
      botResponse = "I can help with account issues. What do you need?";
      nextOptions = ['Update profile', 'Change password', 'Notification settings', 'Other'];
    } else if (option === 'Payment Issue') {
      botResponse = "I can help with payment or wallet issues. What do you need?";
      nextOptions = ['Missing transaction', 'Withdrawal issue', 'Wallet balance incorrect', 'Other'];
    } else if (option === 'Technical Issue') {
      botResponse = "I can help with technical issues. What are you experiencing?";
      nextOptions = ['App crashing', 'Page not loading', 'Login issues', 'Other'];
    } else if (option === 'Create Support Request') {
      botResponse = "Please fill out the details below:";
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString() + 'form', sender: 'bot', text: botResponse, isForm: true }
      ]);
      saveMessage('bot', botResponse);
      return;
    } else if (option === 'Continue Chat') {
      botResponse = "Okay, what else can I assist you with?";
    } else {
      botResponse = "I'm unable to resolve this automatically. Would you like to create a support request for the WrectifAI support team?";
      nextOptions = ['Create Support Request', 'Continue Chat'];
    }

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'bot', text: botResponse, options: nextOptions }
      ]);
      saveMessage('bot', botResponse);
    }, 400);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type: 'image' | 'video' | 'file' = 'file';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';

    const reader = new FileReader();
    reader.onload = (evt) => {
      setSelectedAttachment({
        file,
        dataUrl: evt.target?.result as string,
        type
      });
      setShowAttachMenu(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSendText = async () => {
    if (!inputValue.trim() && !selectedAttachment) return;
    const text = inputValue.trim();
    setInputValue('');
    
    let attachmentUrl = selectedAttachment?.dataUrl;
    let attachmentName = selectedAttachment?.file.name;
    const currentAttachment = selectedAttachment;
    setSelectedAttachment(null);
    setIsSubmitting(true);

    try {
      if (currentAttachment) {
        await apiClient.post<any>('/users/attachments', { fileData: currentAttachment.dataUrl });
      }

      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'user', 
        text, 
        attachmentUrl,
        attachmentName
      }]);
      saveMessage('user', text, attachmentUrl);
      
      setTimeout(() => {
        const botText = "I'm unable to resolve this automatically. Would you like to create a support request for the WrectifAI support team?";
        setMessages(prev => [
          ...prev,
          { 
            id: Date.now().toString(), 
            sender: 'bot', 
            text: botText, 
            options: ['Create Support Request', 'Continue Chat']
          }
        ]);
        saveMessage('bot', botText);
      }, 500);
    } catch (err) {
      setInputValue(text);
      setSelectedAttachment(currentAttachment);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString() + 'err', sender: 'bot', text: "Attachment couldn't be uploaded. Please try again." }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const subject = formData.get('subject') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    try {
      const res = await apiClient.post<any>('/users/support-requests', { 
        subject, category, description,
        attachment: selectedAttachment?.dataUrl,
        conversationId
      });
      
      setSelectedAttachment(null);

      const userMsg = `Submitted support request:\n${subject}`;
      const botMsg = `Your support request has been submitted successfully.\nRequest ID: ${res.id.substring(0,8).toUpperCase()}`;

      setMessages(prev => [
        ...prev.filter(m => !m.isForm),
        { id: Date.now().toString(), sender: 'user', text: userMsg },
        { id: Date.now().toString() + 'res', sender: 'bot', text: botMsg }
      ]);
      
      saveMessage('user', userMsg);
      saveMessage('bot', botMsg);

    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString() + 'err', sender: 'bot', text: "We couldn't submit your support request. Please try again." }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMessageList = (msgList: Message[]) => {
    return msgList.map((msg, idx) => (
      <div key={msg.id} className={cn("flex flex-col gap-1", msg.sender === 'user' ? "items-end" : "items-start")}>
        <div className={cn(
          "px-3 py-2 rounded-2xl max-w-[85%] text-[13px] leading-snug shadow-sm",
          msg.sender === 'user' 
            ? "bg-[#17307a] text-white rounded-tr-sm" 
            : "bg-white dark:bg-[#1A2233] text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-sm"
        )}>
          {msg.sender === 'bot' && (idx === 0 || msgList[idx - 1].sender === 'user') && (
            <div className="flex items-center gap-2 font-bold text-[#17307a] dark:text-blue-400 mb-1">
              <Bot className="w-4 h-4" /> WrectifAI Support
            </div>
          )}
          
          {msg.attachmentUrl && (
            <div className="mb-2 w-full max-w-[200px]">
              {msg.attachmentUrl.startsWith('data:image') ? (
                <img src={msg.attachmentUrl} alt="attachment" className="rounded-lg object-cover w-full h-auto max-h-[150px]" />
              ) : msg.attachmentUrl.startsWith('data:video') ? (
                <video src={msg.attachmentUrl} controls className="rounded-lg w-full max-h-[150px]" />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                  <File className="w-4 h-4 shrink-0" />
                  <span className="truncate text-xs">{msg.attachmentName || 'Attachment'}</span>
                </div>
              )}
            </div>
          )}
          
          {msg.isForm ? (
            <form onSubmit={handleFormSubmit} className="space-y-3 mt-2 min-w-[200px]">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input required name="subject" type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs outline-none" placeholder="Brief summary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select required name="category" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs outline-none">
                  <option>Booking Issue</option>
                  <option>Quote Issue</option>
                  <option>Service Request</option>
                  <option>Account Issue</option>
                  <option>Payment Issue</option>
                  <option>Technical Issue</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea required name="description" rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs outline-none" placeholder="Provide details..." />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-8 text-xs bg-[#17307a] hover:bg-[#12245c] disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Request'}
              </Button>
            </form>
          ) : (
            <p className="whitespace-pre-wrap">{msg.text}</p>
          )}
        </div>
        
        {msg.options && msg.options.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1 ml-1 w-[85%]">
            {msg.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                className="px-2.5 py-1.5 text-[11px] font-semibold bg-white dark:bg-[#1A2233] text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-800 rounded-full hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={
      <div className="flex items-center">
        <span>WrectifAI Support</span>
        {!showHistory && (
          <button 
            onClick={loadHistory}
            className="absolute right-14 top-4 rounded-full p-2 text-[#5f7099] hover:bg-[#f4f7ff] hover:text-[#1a56db] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Support History"
          >
            <History className="w-4 h-4" />
          </button>
        )}
      </div>
    } className="max-w-md bg-slate-50 dark:bg-[#0B0F19]">
      <div className="flex flex-col h-[500px]">
        {showHistory ? (
          selectedHistory ? (
            <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0B0F19]">
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <button onClick={() => setSelectedHistory(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-[13px] text-slate-700 dark:text-slate-200 truncate">{selectedHistory.subject}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-32"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                ) : loadMessagesError ? (
                  <div className="text-center text-sm text-slate-500 py-4">Unable to load this conversation. Please try again.</div>
                ) : historyMessages.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 justify-center">
                      Historical Conversation
                    </div>
                    {renderMessageList(historyMessages)}
                  </>
                ) : (
                  <>
                    <div className="text-center text-[11px] text-slate-500 mb-4 bg-slate-100 dark:bg-slate-800 py-2 rounded-lg px-2">
                      This conversation was created before full chat history was available.
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <div className="px-3 py-2 rounded-2xl max-w-[85%] text-[13px] leading-snug shadow-sm bg-[#17307a] text-white rounded-tr-sm">
                        <div className="whitespace-pre-wrap">{selectedHistory.description}</div>
                        {selectedHistory.attachment && (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            {selectedHistory.attachment.startsWith('data:image') ? (
                              <img src={selectedHistory.attachment} alt="attachment" className="rounded-lg object-cover w-full h-auto max-h-[150px]" />
                            ) : selectedHistory.attachment.startsWith('data:video') ? (
                              <video src={selectedHistory.attachment} controls className="rounded-lg w-full max-h-[150px]" />
                            ) : (
                              <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                                <File className="w-4 h-4 shrink-0" />
                                <span className="truncate text-xs">Attached File</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-1 items-start mt-4">
                  <div className="px-3 py-2 rounded-2xl max-w-[85%] text-[13px] leading-snug shadow-sm bg-white dark:bg-[#1A2233] text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-sm">
                    <div className="font-bold mb-2 text-[#17307a] dark:text-blue-400">Support Request</div>
                    <div className="mb-1">Status: <span className="capitalize font-medium text-slate-900 dark:text-white">{selectedHistory.status.replace('_', ' ')}</span></div>
                    <div>Category: <span className="text-slate-900 dark:text-white">{selectedHistory.category}</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">
                      Request ID: {selectedHistory.id.substring(0,8).toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0B0F19]">
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-[13px] text-slate-700 dark:text-slate-200">Support History</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-full"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                ) : historyItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <History className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm">No support history yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {historyItems.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => handleSelectHistory(item)}
                        className="w-full text-left p-3 rounded-xl bg-white dark:bg-[#1A2233] border border-slate-200 dark:border-slate-800 hover:border-[#17307a] dark:hover:border-blue-500 transition-colors flex items-center justify-between group"
                      >
                        <div className="overflow-hidden">
                          <div className="font-medium text-[13px] text-slate-800 dark:text-slate-200 truncate">{item.subject}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • {item.category}
                          </div>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-500 rotate-180 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
              </div>
              
              {renderMessageList(messages)}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1A2233] flex flex-col gap-2 relative">
              {selectedAttachment && (
                <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg mr-auto max-w-[80%] border border-slate-200 dark:border-slate-700">
                  {selectedAttachment.type === 'image' ? (
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                  ) : selectedAttachment.type === 'video' ? (
                    <Video className="w-4 h-4 text-slate-500" />
                  ) : (
                    <File className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="text-[11px] truncate text-slate-700 dark:text-slate-300 font-medium">
                    {selectedAttachment.file.name}
                  </span>
                  <button onClick={() => setSelectedAttachment(null)} className="ml-1 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="relative" ref={attachMenuRef}>
                  <button 
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors shrink-0"
                    disabled={isSubmitting}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {showAttachMenu && (
                    <div className="absolute bottom-11 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1.5 w-32 flex flex-col gap-1 z-10">
                      <button onClick={() => { fileInputRef.current!.accept = "image/*"; fileInputRef.current?.click(); }} className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <ImageIcon className="w-4 h-4 text-slate-500" /> Photo
                      </button>
                      <button onClick={() => { fileInputRef.current!.accept = "video/*"; fileInputRef.current?.click(); }} className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Video className="w-4 h-4 text-slate-500" /> Video
                      </button>
                      <button onClick={() => { fileInputRef.current!.accept = ".pdf,.doc,.docx,.txt"; fileInputRef.current?.click(); }} className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <File className="w-4 h-4 text-slate-500" /> File
                      </button>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileSelect}
                />
                
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder="Type your message..." 
                  className="flex-1 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 text-[13px] outline-none text-slate-700 dark:text-slate-200 focus:border-[#17307a] disabled:opacity-50 transition-colors"
                  disabled={isSubmitting}
                />
                <button 
                  onClick={handleSendText}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#17307a] text-white hover:bg-[#12245c] transition-colors shrink-0 disabled:opacity-50"
                  disabled={(!inputValue.trim() && !selectedAttachment) || isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
