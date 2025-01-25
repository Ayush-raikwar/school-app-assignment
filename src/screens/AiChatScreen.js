import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'; 
import { generateContent } from '../geminiApi';


export const AiChatScreen = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!query) return alert('Please enter a query!');
    setLoading(true);
    setResponse(null); 
    try {
      const data = await generateContent(query);
      setResponse(data);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Your Query:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your query here"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Generate Content" onPress={handleGenerate} />
      {loading && (
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('../assets/animations/gemini_loading.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      )}
      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>
            Response: {JSON.stringify(response?.candidates[0]?.content?.parts[0]?.text)}
          </Text>
        </View>
      )}
      <LottieView
        source={require('../assets/animations/gemini_animation.json')}
        autoPlay
        loop
        style={styles.geminiLogo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  geminiLogo: {
    width:150,height:150, margin:'auto'
  },
  container: { flex: 1, padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  lottieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  lottie: { width: 150, height: 150 },
  responseContainer: { marginTop: 20 },
  responseText: { fontSize: 16, color: '#333' },
});

