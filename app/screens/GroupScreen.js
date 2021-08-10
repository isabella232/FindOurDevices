import React, { useState, useMemo, useLayoutEffect } from 'react';
import { Text, View, Alert, Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '../providers/AuthProvider';
import { useGroup } from '../providers/GroupProvider';
import { useGroupManager } from '../hooks/useGroupManager';
import { useToggle } from '../hooks/useToggle';
import { Button } from '../components/Button';
import { FormTextInput } from '../components/FormTextInput';
import { List } from '../components/List';
import { ItemSeparator } from '../components/ItemSeparator';
import { ModalForm } from '../components/ModalForm';
import routes from '../navigation/routes';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function GroupScreen({ navigation }) {
  const { userData } = useAuth();
  const group = useGroup();
  const { inviteGroupMember, removeGroupMember, setShareLocation } = useGroupManager();
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [modalVisible, closeModal]= useToggle(navigation, 'plus-circle');

  useLayoutEffect(() => {
    // In order to set header options based on information available only in this component
    // we need to define the header options using 'navigation.setOptions' inside this component.
    navigation.setOptions({ headerTitle: group ? group.name : 'Loading...' });
  }, [navigation, group]);

  const handleInviteMember = async () => {
    if (!newMemberEmail)
      return;

    // Our MongoDB Realm backend function will return an object
    // containing an error property if any errors occurred.
    const { error } = await inviteGroupMember(group._id, newMemberEmail);
    if (error)
      return Alert.alert(error.message);

    closeModal();
    setNewMemberEmail('');
  };

  const handleRemoveMember = async (memberId) => {
    const { error } = await removeGroupMember(group._id, memberId);
    if (error)
      return Alert.alert(error.message);
  };

  const handleCancelInviteMember = () => {
    closeModal();

    if (newMemberEmail)
      setNewMemberEmail('');
  };

  // Every GroupMembership object in the user's "groups" array contains the field "shareLocation"
  const shareLocation = useMemo(() => userData.groups
    .filter(groupMembership => groupMembership.groupId.toString() === group?._id.toString())[0]?.shareLocation
  , [userData, group]);

  const handleSetShareLocation = async () => {
    const { error } = await setShareLocation(group._id, !shareLocation);
    if (error)
      return Alert.alert(error.message);
  };

  return (
    <>
    <View style={styles.screen}>
      {group && (
        <>
        <View style={styles.infoContainer}>
          <Text
            numberOfLines={1}
            style={styles.infoText}
          >
            Location sharing:
          </Text>
          <Pressable onPress={handleSetShareLocation}>
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons
                name={shareLocation ? 'eye-outline' : 'eye-off-outline'}
                color={shareLocation ? colors.primary : colors.grayMedium}
                size={25}
              />
            </View>
          </Pressable>
        </View>
        <ItemSeparator />
        <List
          items={group.members}
          keyExtractor={(member) => member.userId.toString()}
          itemTextExtractor={(member) => member.displayName}
          rightActions={[
            {
              actionType: 'remove-member',
              onPress: (member) => handleRemoveMember(member.userId)
            }
          ]}
        />
        </>
      )}
      <View style={styles.buttonContainer}>
        <Button
          text='View Map'
          onPress={() => navigation.navigate(routes.GROUP_MAP)}
          style={{ marginBottom: 30 }}
        />
      </View>
    </View>
    <ModalForm
      visible={modalVisible}
      title='Invite Member'
      submitText='Invite'
      onSubmit={handleInviteMember}
      onCancel={handleCancelInviteMember}
    >
      <FormTextInput
        placeholder='Email'
        value={newMemberEmail}
        onChangeText={setNewMemberEmail}
        autoCorrect={false}
        autoCapitalize='none'
        keyboardType='email-address'
        textContentType='emailAddress'  // iOS only
      />
    </ModalForm>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  infoContainer: {
    alignSelf: 'stretch',
    height: 80,
    paddingLeft: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoText: {
    fontSize: fonts.sizeM,
    color: colors.grayDark
  },
  infoIconContainer: {
    width: 46,
    height: 46,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.grayMedium,
    borderWidth: 1,
    borderRadius: 23
  },
  buttonContainer: {
    marginHorizontal: 15
  }
});
