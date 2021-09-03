import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { GroupProvider } from '../providers/GroupProvider';
import { GroupsScreen } from '../screens/GroupsScreen';
import { GroupScreen } from '../screens/GroupScreen';
import { GroupMapScreen } from '../screens/GroupMapScreen';
import { Icon } from '../components/Icon';
import { routes } from './routes';
import { colors } from '../styles/colors';

const Stack = createStackNavigator();

export function GroupsNavigator() {
  const [groupId, setGroupId] = useState(null);

  return (
    <Stack.Navigator screenOptions={{ headerStyle: styles.shadow }}>
      <Stack.Screen
        name={routes.GROUPS}
        // 'options.headerRight' is set in the GroupsScreen with 'navigation.setOptions' via our useToggle hook
      >
        {/* To pass custom props to a screen component, return the component from a function as the child */}
        {/* of this Stack.Screen. All regular props that screen components get (such as 'navigation' and */}
        {/* 'route') are passed as the first argument to this function. */}
        {(props) => (
          <GroupsScreen
            {...props}
            setGroupId={setGroupId}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={routes.GROUP}
        options={{
          // Since this Stack.Screen is rendering another Stack.Navigator, hide the header to prevent two
          // headers from showing simultaneously.
          headerShown: false
        }}
      >
        {(props) => (
          // In order for the GroupScreen and GroupMapScreen to share the context provided by GroupProvider, 
          // we need to create a separate Stack.Navigator that is wrapped by GroupProvider. This forces the
          // GroupProvider to unmount whenever an app user navigates away from an individual group.
          // When the GroupProvider unmounts, it then closes the associated group realm and removes its listeners
          // (There is no need to listen for changes in a group that an app user is not currently looking at.)
          <GroupProvider groupId={groupId}>
            <Stack.Navigator screenOptions={{ headerStyle: styles.shadow }}>
              <Stack.Screen
                name={routes.GROUP}
                component={GroupScreen}
                options={{
                  headerBackTitleVisible: false,
                  headerBackImage: ({/* tintColor */}) => (
                    <Icon
                      name='chevron-left'
                      color={colors.primary}
                      size={30}
                      style={{ marginLeft: 10 }}
                    />
                  )
                  // 'options.headerRight' is set in the GroupScreen with 'navigation.setOptions' via our useToggle hook
                }}
              />
              <Stack.Screen
                name={routes.GROUP_MAP}
                component={GroupMapScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </GroupProvider>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 2
      },
    })
  }
});
