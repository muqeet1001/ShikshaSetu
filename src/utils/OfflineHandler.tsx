import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Network state context
interface NetworkState {
  isConnected: boolean;
  isOffline: boolean;
  connectionType: string | null;
  lastSyncTime: Date | null;
  syncInProgress: boolean;
}

interface OfflineContextType extends NetworkState {
  showOfflineIndicator: boolean;
  isLinkDisabled: (url: string) => boolean;
  getCachedData: (key: string) => any;
  setCachedData: (key: string, data: any) => void;
  syncData: () => Promise<void>;
  retryConnection: () => void;
}

const OfflineContext = createContext<OfflineContextType>({
  isConnected: true,
  isOffline: false,
  connectionType: null,
  lastSyncTime: null,
  syncInProgress: false,
  showOfflineIndicator: false,
  isLinkDisabled: () => false,
  getCachedData: () => null,
  setCachedData: () => {},
  syncData: async () => {},
  retryConnection: () => {},
});

// Offline Provider Component
interface OfflineProviderProps {
  children: React.ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isOffline: false,
    connectionType: null,
    lastSyncTime: null,
    syncInProgress: false,
  });

  const [cachedData, setCachedDataState] = useState<{ [key: string]: any }>({});
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);

  // Simulate network monitoring for demo purposes
  useEffect(() => {
    // For demo, assume we're always online
    setNetworkState(prev => ({
      ...prev,
      isConnected: true,
      isOffline: false,
      connectionType: 'wifi',
    }));
  }, []);

  // Load cached data on app start
  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = async () => {
    try {
      // For demo, use local state instead of AsyncStorage
      console.log('Loading cached data (demo mode)');
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const getCachedData = (key: string) => {
    return cachedData[key] || null;
  };

  const setCachedData = async (key: string, data: any) => {
    const newCachedData = { ...cachedData, [key]: data };
    setCachedDataState(newCachedData);
    
    try {
      // For demo, just use local state
      console.log('Saving cached data (demo mode):', key);
    } catch (error) {
      console.error('Error saving cached data:', error);
    }
  };

  const isLinkDisabled = (url: string): boolean => {
    if (!networkState.isConnected) {
      // Disable external links when offline
      if (url.includes('linkedin.com') || url.includes('twitter.com') || url.includes('mailto:')) {
        return true;
      }
    }
    return false;
  };

  const syncData = async (): Promise<void> => {
    if (!networkState.isConnected || networkState.syncInProgress) {
      return;
    }

    setNetworkState(prev => ({ ...prev, syncInProgress: true }));

    try {
      // Simulate data sync - in real app, sync with API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setNetworkState(prev => ({
        ...prev,
        syncInProgress: false,
        lastSyncTime: new Date(),
      }));

      console.log('Data sync completed');
    } catch (error) {
      setNetworkState(prev => ({ ...prev, syncInProgress: false }));
      console.error('Data sync failed:', error);
      Alert.alert('Sync Failed', 'Unable to sync data. Please try again later.');
    }
  };

  const retryConnection = () => {
    // For demo, simulate connection check
    setShowOfflineIndicator(false);
    Alert.alert('Connection Restored', 'Demo mode - connection restored.');
    syncData();
  };

  return (
    <OfflineContext.Provider
      value={{
        ...networkState,
        showOfflineIndicator,
        isLinkDisabled,
        getCachedData,
        setCachedData,
        syncData,
        retryConnection,
      }}
    >
      {children}
      {showOfflineIndicator && <OfflineIndicator />}
    </OfflineContext.Provider>
  );
};

// Offline Indicator Component
const OfflineIndicator: React.FC = () => {
  const { retryConnection, syncInProgress, lastSyncTime } = useContext(OfflineContext);

  const formatLastSync = (): string => {
    if (!lastSyncTime) return 'never';
    
    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <View style={indicatorStyles.container}>
      <View style={indicatorStyles.content}>
        <View style={indicatorStyles.leftSection}>
          <Ionicons name="cloud-offline" size={20} color="#F59E0B" />
          <View style={indicatorStyles.textSection}>
            <Text style={indicatorStyles.title}>Offline</Text>
            <Text style={indicatorStyles.subtitle}>
              Last sync: {formatLastSync()}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            indicatorStyles.retryButton,
            syncInProgress && indicatorStyles.retryButtonDisabled
          ]}
          onPress={retryConnection}
          disabled={syncInProgress}
        >
          <Ionicons 
            name={syncInProgress ? "sync" : "refresh"} 
            size={16} 
            color={syncInProgress ? "#9CA3AF" : "#3B82F6"} 
          />
          <Text style={[
            indicatorStyles.retryText,
            syncInProgress && indicatorStyles.retryTextDisabled
          ]}>
            {syncInProgress ? 'Syncing...' : 'Retry'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Hook to use offline context
export const useOffline = () => {
  return useContext(OfflineContext);
};

// Cached Admits Label Component
interface CachedAdmitsLabelProps {
  admitCount: number;
  academicYear: string;
  lastSyncTime?: string;
}

export const CachedAdmitsLabel: React.FC<CachedAdmitsLabelProps> = ({
  admitCount,
  academicYear,
  lastSyncTime
}) => {
  const { isOffline } = useOffline();
  
  if (!isOffline) return null;

  const formatSyncTime = (syncTime?: string): string => {
    if (!syncTime) return 'unknown';
    
    try {
      const date = new Date(syncTime);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    } catch {
      return 'unknown';
    }
  };

  return (
    <View style={cachedStyles.container}>
      <View style={cachedStyles.header}>
        <Ionicons name="download" size={14} color="#6B7280" />
        <Text style={cachedStyles.title}>Cached Data</Text>
      </View>
      <Text style={cachedStyles.content}>
        <Text style={cachedStyles.count}>{admitCount}</Text> admits (AY {academicYear})
      </Text>
      <Text style={cachedStyles.syncInfo}>
        Offline — last sync {formatSyncTime(lastSyncTime)}
      </Text>
    </View>
  );
};

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class OfflineErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Offline Error Boundary caught an error:', error, errorInfo);
    
    // Log to error reporting service in production
    if (__DEV__) {
      console.log('Error Info:', errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <View style={errorStyles.content}>
            <Ionicons name="warning" size={48} color="#F59E0B" />
            <Text style={errorStyles.title}>Something went wrong</Text>
            <Text style={errorStyles.message}>
              The app encountered an error. This might be due to network issues or corrupted data.
            </Text>
            <TouchableOpacity
              style={errorStyles.retryButton}
              onPress={() => this.setState({ hasError: false })}
            >
              <Text style={errorStyles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// Styles
const indicatorStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textSection: {
    marginLeft: 8,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  subtitle: {
    fontSize: 12,
    color: '#A16207',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  retryButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  retryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
  },
  retryTextDisabled: {
    color: '#9CA3AF',
  },
});

const cachedStyles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    padding: 8,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  content: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 2,
  },
  count: {
    fontWeight: '700',
    color: '#10B981',
  },
  syncInfo: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});