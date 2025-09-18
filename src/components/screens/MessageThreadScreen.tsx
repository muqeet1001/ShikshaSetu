import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'system';
}

interface MessageThreadScreenProps {
  navigation: any;
  route: any;
}

export function MessageThreadScreen({ navigation, route }: MessageThreadScreenProps) {
  const { mentor } = route?.params || {};
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'system',
      content: `You are now connected with ${mentor?.name || 'the mentor'}. You can start your conversation here.`,
      timestamp: new Date().toISOString(),
      isRead: true,
      type: 'system'
    }
  ]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'user',
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      
      // Simulate mentor response after 2 seconds
      setTimeout(() => {
        const mentorResponse: Message = {
          id: (Date.now() + 1).toString(),
          senderId: mentor?.id || 'mentor',
          content: `Thanks for reaching out! I'd be happy to help you with your career questions. What specific area would you like to discuss?`,
          timestamp: new Date().toISOString(),
          isRead: false,
          type: 'text'
        };
        setMessages(prev => [...prev, mentorResponse]);
      }, 2000);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => {
    const isUser = message.senderId === 'user';
    const isSystem = message.type === 'system';

    if (isSystem) {
      return (
        <View key={message.id} style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{message.content}</Text>
        </View>
      );
    }

    return (
      <View key={message.id} style={[styles.messageContainer, isUser ? styles.userMessage : styles.mentorMessage]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.mentorBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.mentorMessageText]}>
            {message.content}
          </Text>
          <Text style={[styles.messageTime, isUser ? styles.userMessageTime : styles.mentorMessageTime]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ecfdf5', '#ffffff']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          
          <View style={styles.mentorInfo}>
            <Text style={styles.mentorName}>{mentor?.name || 'Mentor'}</Text>
            <Text style={styles.mentorRole}>
              {mentor?.currentRole} at {mentor?.currentCompany}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => Alert.alert('Options', 'More options coming soon!')}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <KeyboardAvoidingView 
          style={styles.messagesContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map(renderMessage)}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
                onPress={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={messageText.trim() ? "#FFFFFF" : "#9CA3AF"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 12,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  mentorRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessageText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  mentorMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  mentorBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  mentorMessageText: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userMessageTime: {
    color: '#E0E7FF',
    textAlign: 'right',
  },
  mentorMessageTime: {
    color: '#9CA3AF',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
  sendButtonInactive: {
    backgroundColor: '#E5E7EB',
  },
});

