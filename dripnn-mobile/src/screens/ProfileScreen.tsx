import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { useFeedback } from '../hooks/useFeedback';
import { StyleDistribution } from '../components/StyleDistribution';
import { LikedItemsGallery } from '../components/LikedItemsGallery';

export const ProfileScreen: React.FC = () => {
  const { state: userState, login, logout, updateUser } = useUser();
  const { likedItems, dislikedItems, getStyleDistribution, clearFeedback } = useFeedback(
    userState.user?.id || 0
  );

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDisliked, setShowDisliked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userState.user?.nickname) {
      setNickname(userState.user.nickname);
    }
  }, [userState.user]);

  const handleLogin = async () => {
    if (!nickname.trim()) {
      Alert.alert('Error', 'Please enter a nickname');
      return;
    }

    try {
      setIsLoading(true);
      await login(nickname.trim(), password.trim() || undefined);
      setIsEditing(false);
      setPassword('');
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? Your anonymous session will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            setNickname('');
            setPassword('');
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all your liked and disliked items. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearFeedback();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const styleData = getStyleDistribution();
  const displayItems = showDisliked ? dislikedItems : likedItems;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        {userState.user?.nickname ? (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* User Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Information</Text>
        
        {userState.user?.nickname ? (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userState.user.nickname}</Text>
            <Text style={styles.userId}>ID: {userState.user.id}</Text>
          </View>
        ) : (
          <View style={styles.anonymousInfo}>
            <Text style={styles.anonymousText}>Anonymous User</Text>
            <Text style={styles.userId}>ID: {userState.user?.id}</Text>
          </View>
        )}

        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editText}>
              {userState.user?.nickname ? 'Edit Profile' : 'Create Profile'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editForm}>
            <TextInput
              style={styles.input}
              placeholder="Enter nickname"
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password (optional)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditing(false);
                  setNickname(userState.user?.nickname || '');
                  setPassword('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Style Distribution Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Style Preferences</Text>
        <StyleDistribution data={styleData} />
      </View>

      {/* Items Gallery Section */}
      <View style={styles.section}>
        <View style={styles.galleryHeader}>
          <Text style={styles.sectionTitle}>
            {showDisliked ? 'Disliked Items' : 'Liked Items'}
          </Text>
          <View style={styles.galleryControls}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !showDisliked && styles.toggleButtonActive,
              ]}
              onPress={() => setShowDisliked(false)}
            >
              <Text
                style={[
                  styles.toggleText,
                  !showDisliked && styles.toggleTextActive,
                ]}
              >
                Liked
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                showDisliked && styles.toggleButtonActive,
              ]}
              onPress={() => setShowDisliked(true)}
            >
              <Text
                style={[
                  styles.toggleText,
                  showDisliked && styles.toggleTextActive,
                ]}
              >
                Disliked
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <LikedItemsGallery items={displayItems} />
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
          <Text style={styles.clearText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  userInfo: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: '#666',
  },
  anonymousInfo: {
    marginBottom: 16,
  },
  anonymousText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editForm: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  galleryControls: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  clearButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    alignSelf: 'center',
  },
  clearText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});