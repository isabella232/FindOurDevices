import { BSON } from 'realm';

/** Class representing a user. */
export class User {
  /**
   * Create a User.
   * @param {Object} props
   * @param {BSON.ObjectId} [props.id=new BSON.ObjectId()] - The ID of the user.
   * @param {string} props.partition - The partition value to use for the object.
   * @param {string} props.email - The user's email.
   * @param {string} props.displayName - The user's name to be displayed.
   * @param {BSON.ObjectId[]} [props.deviceIds=[]] - The array of device's IDs which belong to the user.
   * @param {GroupMembership[]} [props.groupMemberships=[]] - The array of group memberships of the user.
   * @param {GroupInvitation[]} [props.groupInvitations=[]] - The array of group invitations of the user.
   */
  constructor({ id = new BSON.ObjectId(), partition, email, displayName, deviceIds = [], groupMemberships = [], groupInvitations = [] }) {
    this._id = id;
    this._partition = partition;
    this.email = email;
    this.displayName = displayName;
    this.deviceIds = deviceIds;
    this.groups = groupMemberships;
    this.invitations = groupInvitations;
  }

  // To use a class as an object type, define the object schema on the static property 'schema'.
  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      email: 'string',
      displayName: 'string',
      deviceIds: 'objectId[]',
      groups: { type: 'list', objectType: 'GroupMembership' },
      invitations: { type: 'list', objectType: 'GroupInvitation' }
    }
  };
}
