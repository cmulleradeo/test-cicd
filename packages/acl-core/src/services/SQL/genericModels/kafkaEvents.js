/**
 * Function returning the attributes of the events generic tables, necessary for the instantiation of the Sequelize Model.
 * See {@link https://sequelize.org/master/class/lib/model.js~Model.html#static-method-init|Sequelize init() method} for further information.
 *
 * @param {object} DataTypes - SQL service DataTypes.
 * @returns {object} Object containing table attributes.
 */
const getAttributes = (DataTypes) => {
  return {
    id: {
      field: 'id',
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      field: 'key',
      type: DataTypes.TEXT,
      allowNull: false
    },
    topic: {
      field: 'topic',
      type: DataTypes.STRING,
      allowNull: false
    },
    published_time: {
      field: 'published_time',
      type: DataTypes.DATE,
      allowNull: true
    },
    extracted_time: {
      field: 'extracted_time',
      type: DataTypes.DATE,
      allowNull: false
    },
    headers: {
      field: 'headers',
      type: DataTypes.TEXT,
      allowNull: false
    },
    json: {
      field: 'json',
      type: DataTypes.TEXT,
      allowNull: false
    },
    error_message: {
      field: 'error_message',
      type: DataTypes.TEXT,
      allowNull: true,
      default: null
    },
    error_date: {
      field: 'error_date',
      type: DataTypes.DATE,
      allowNull: true,
      default: null
    }
  }
}

export default {
  getAttributes
}
