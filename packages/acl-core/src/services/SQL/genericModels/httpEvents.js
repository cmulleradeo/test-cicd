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
      field: 'id', // Self-incrementing primary table key
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    request_method: {
      field: 'request_method', // GET? PUT? DELETE..?
      type: DataTypes.STRING,
      allowNull: false
    },
    request_url: {
      field: 'request_url', // Absolute URL with http, the query...
      type: DataTypes.TEXT,
      allowNull: false
    },
    request_headers: {
      field: 'request_headers', // Specific headers we need for this API call
      type: DataTypes.TEXT,
      allowNull: false
    },
    request_body: {
      field: 'request_body',
      type: DataTypes.TEXT,
      allowNull: false
    },
    request_insertion_date: {
      field: 'request_insertion_date',
      type: DataTypes.DATE,
      allowNull: false
    },
    response_code: {
      field: 'response_code', // HTTP return code
      type: DataTypes.INTEGER,
      allowNull: true
    },
    response_body: {
      field: 'response_body',
      type: DataTypes.TEXT,
      allowNull: true
    },
    response_headers: {
      field: 'response_headers',
      type: DataTypes.TEXT,
      allowNull: true
    },
    response_date: {
      field: 'response_date', // Date at which the API response was retrieved
      type: DataTypes.DATE,
      allowNull: true
    },
    nb_of_tries: {
      field: 'nb_of_tries', // Number of times the API call was attempted
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    extracted_time: {
      field: 'extracted_time', // Date at which the API response was retrieved
      type: DataTypes.DATE,
      allowNull: true
    }
  }
}

export default {
  getAttributes
}
