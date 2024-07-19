import React from 'react';
import ChatInterface from './components/ChatInterface';
import AvatarRenderer from './components/AvatarRenderer';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="avatar-container">
        <AvatarRenderer />
      </div>
      <div className="chat-container">
        <ChatInterface />
      </div>
    </div>
  );
}

export default App;