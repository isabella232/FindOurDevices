import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';

import { ListItem } from './ListItem';
import { ListItemAction } from './ListItemAction';
import { ListItemSeparator } from './ListItemSeparator';
import { fonts } from '../styles/fonts';
import { colors } from '../styles/colors';

/**
 * Create a list component.
 * @param {Object} props
 * @param {[]} [props.items] - The list items.
 * @param {function} props.keyExtractor - Function that returns a unique key to use for the item.
 * @param {function} [props.itemTextExtractor=() => {}] - Function that returns the text to use for the item.
 * @param {function} [props.itemSubTextExtractor=() => {}] - Function that returns the subtext to use for the item.
 * @param {function} [props.onItemPress=() => {}] - Callback function to be called when a list item is pressed.
 * @param {boolean} props.fadeOnPress - A boolean which tells if a list item should fade when being pressed if true.
 * @param {Object[]]} [props.rightActions=[]] - An array of actions for each list item.
 * @param {string} props.rightActions[].actionType - A string that specifies the icon that should be used.
 * @param {function} props.rightActions[].onPress - Callback function to be called when the list item action is pressed.
 * @param {string} [props.emptyListText='The list is empty.'] - A text to display if the list has no items.
 * @return {React.Component} A list component.
 */
export function List({
  items,
  keyExtractor,
  itemTextExtractor = () => {},
  itemSubTextExtractor = () => {},
  onItemPress = () => {},
  fadeOnPress,
  rightActions = [],
  emptyListText = 'The list is empty.'
}) {
  return (
    <View style={styles.list}>
      {items?.length ? (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <ListItem
              text={itemTextExtractor(item)}
              subText={itemSubTextExtractor(item)}
              onPress={() => onItemPress(item)}
              fadeOnPress={fadeOnPress}
              renderRightActions={() => (
                <View style={styles.actionsContainer}>
                  {rightActions.map(({ actionType, onPress }, index) => (
                    <ListItemAction
                      key={index}
                      action={actionType}
                      onPress={() => onPress(item)}
                    />
                  ))}
                </View>
              )}
            />
          )}
          ItemSeparatorComponent={ListItemSeparator}
        />
      ) : (
        <Text style={styles.info}>
          {emptyListText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: fonts.sizeM,
    color: colors.grayDark
  }
});
