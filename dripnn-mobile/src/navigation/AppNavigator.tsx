import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { SwipeScreen } from '../screens/SwipeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MyItemScreen } from '../screens/MyItemScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eee',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tab.Screen
          name="Swipe"
          component={SwipeScreen}
          options={{
            tabBarLabel: 'Discover',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>🔍</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>👤</Text>
            ),
          }}
        />
        <Tab.Screen
          name="MyItem"
          component={MyItemScreen}
          options={{
            tabBarLabel: 'My Item',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📸</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};