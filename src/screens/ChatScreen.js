import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, Text } from 'react-native';
import axios from 'axios';

export const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { sender: 'User', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('https://api.example.com/chat', {
        message: input,
      });
      setMessages([...newMessages, { sender: 'API', text: response.data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'API', text: 'Error fetching response' }]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView>
        {messages.map((msg, index) => (
          <Text key={index} style={{ color: msg.sender === 'User' ? 'blue' : 'green' }}>
            {msg.text}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={input}
        onChangeText={setInput}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

