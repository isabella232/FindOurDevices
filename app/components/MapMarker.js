import React, { memo } from 'react';
import { Marker, Callout } from 'react-native-maps-osmdroid';
import { Text, StyleSheet, View } from 'react-native';
import Moment from 'react-moment';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.001;

/**
 * Create a marker component.
 * @param {Object} props
 * @param {string} props.label - The marker label.
 * @param {Object} props.location - The marker location.
 * @param {number} props.location.latitude - The marker latitude.
 * @param {number} props.location.longitude - The marker longitude.
 * @param {Date} props.location.updatedAt - The timestamp of the marker location.
 * @param {string} props.color - The color to use for the marker (iOS only).
 * @return {React.Component} A map marker component.
 */
export const MapMarker = memo(function MapMarker({ label, location, color }) {
  return (
    <Marker
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }}
      pinColor={color}
    >
      <Callout>
        <View style={styles.calloutView}>
          <Text style={styles.calloutLabel}>
            { label }
          </Text>
          <Text style={styles.calloutTimestamp}>
            {'Updated'} <Moment element={Text} fromNow>{location.updatedAt}</Moment>
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}, shouldNotRerender);

const styles = StyleSheet.create({
  calloutView: {
    width: 200
  },
  calloutLabel : {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  calloutTimestamp: {
    textAlign: 'center'
  }
});

const shouldNotRerender = (prevProps, nextProps) => (
  prevProps.location.updatedAt === nextProps.location.updatedAt
  && prevProps.color === nextProps.color
  && prevProps.label === nextProps.label
);
