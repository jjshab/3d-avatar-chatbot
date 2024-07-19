import React, { useEffect, useRef, useState } from 'react';
import { ConvaiClient } from 'convai-web-sdk';
import { CONVAI_API_KEY, CHARACTER_ID } from '../ConvaiConfig';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const convaiClient = useRef(null);

  useEffect(() => {

    convaiClient.current = new ConvaiClient({
      apiKey: CONVAI_API_KEY,
      characterId: CHARACTER_ID,
      enableAudio: true,
      enableFacialData: true,
      faceModel: 3, // OVR lipsync
      audioQuality: 'high',  // Try 'medium' or 'low' if 'high' doesn't work well
      sampleRate: 44100,  // You can try different sample rates: 8000, 16000, 44100
    });

    convaiClient.current.setResponseCallback((response) => {
      console.log("Response received:", response); 
      if (response.hasAudioResponse()) {
        const audioResponse = response.getAudioResponse();
        const textData = audioResponse.getTextData();
        if (textData) {
          setMessages(prev => [...prev, { text: textData, sender: 'bot' }]);
        }
      }
      if (response.hasUserQuery()) {
        const userQuery = response.getUserQuery();
        const transcriptText = userQuery.getTextData();
        const isFinal = userQuery.getIsFinal();
        console.log("User query:", transcriptText, "Is final:", isFinal);  // Debug log
        if (transcriptText && isFinal) {
          setMessages(prev => [...prev, { text: transcriptText, sender: 'user' }]);
        }
      }
    });

    convaiClient.current.onAudioPlay(() => {
      console.log("Audio started playing");
    });

    convaiClient.current.onAudioStop(() => {
      console.log("Audio stopped playing");
    });

    return () => {
      if (convaiClient.current) {
        convaiClient.current.resetSession();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    setMessages(prev => [...prev, { text: inputText, sender: 'user' }]);
    setInputText('');

    convaiClient.current.sendTextChunk(inputText);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      console.log("Starting audio chunk");  // Debug log
      convaiClient.current.startAudioChunk();
    } else {
      console.log("Ending audio chunk");  // Debug log
      convaiClient.current.endAudioChunk();
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
        <button onClick={handleVoiceInput}>
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
      </div>
    </div>
  );
}

export default ChatInterface;