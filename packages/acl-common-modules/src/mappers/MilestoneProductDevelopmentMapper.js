import BaseMapper from './BaseMapper'

export default class MilestoneProductDevelopmentMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      // { apiField: '$id', aclField: 'id' },
      // { apiField: 'plan_secondary', rabbitMqField: 'id', aclField: 'merchSecondaryPlanId' },
      // { apiField: 'adeo_merch_second_ver_secondary_type_string', rabbitMqField: 'id', aclField: 'secondaryType' },
      // { apiField: 'adeo_merch_second_ver_ressource_total_days_double', rabbitMqField: 'id', aclField: 'resourceTotalDays' },
      // { apiField: 'adeo_office_leader', rabbitMqField: 'id', aclField: 'officeLeader' },
      // { apiField: 'adeo_office_challenger', rabbitMqField: 'id', aclField: 'officeChallenger' },
      // { apiField: 'adeo_merch_second_ver_whos_in_string', rabbitMqField: 'id', aclField: 'whosIn' },
      // { apiField: 'adeo_merch_second_ver_category_enum', rabbitMqField: 'id', aclField: 'resourceCategory' },
      // { apiField: 'adeo_calendar_activity_adeo_merch_second_ver_o_vor_ressource_y_doublebase_step_status_enum', rabbitMqField: 'id', aclField: 'OVorRessourceY' },
      // { apiField: 'adeo_merch_second_ver_o_vor_ressource_y1_double', rabbitMqField: 'id', aclField: 'OVorRessourceY1' },
      // { apiField: 'adeo_merch_second_ver_o_vor_ressource_y2_double', rabbitMqField: 'id', aclField: 'OVorRessourceY2' },
      // { apiField: 'adeo_merch_second_ver_o_vor_ressource_y3_double', rabbitMqField: 'id', aclField: 'OVorRessourceY3' },
      // { apiField: 'adeo_merch_second_ver_total_cost_double', rabbitMqField: 'id', aclField: 'totalCost' }
    ]
  }
}
