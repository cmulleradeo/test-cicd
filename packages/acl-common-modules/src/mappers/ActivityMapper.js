import BaseMapper from './BaseMapper'

const stepStatusConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_CalendarStepStatus:Requested':
      return 'Expected'
    case 'ADEO_CalendarStepStatus:Pending Approval':
      return 'Pending'
    case 'ADEO_CalendarStepStatus:Approved':
      return 'Pass'
    case 'ADEO_CalendarStepStatus:Rejected':
      return 'Fail'
    default:
      return null
  }
}

const essentialDeliverableConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_Essential:010':
      return 'Unmissable'
    case 'ADEO_Essential:020':
      return 'Optionnal'
    default:
      return null
  }
}

const stepTypeConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_CalendarStepTypes:Free-Task':
      return 'Free-Task'
    case 'ADEO_CalendarStepTypes:Deliverable':
      return 'Deliverable'
    case 'ADEO_CalendarStepTypes:Milestone':
      return 'Milestone'
    case 'ADEO_CalendarStepTypes:Check':
      return 'Check'
    default:
      return null
  }
}

const milestoneConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_Milestones:Go for Project':
      return 'PR Go for Project'
    case 'ADEO_Milestones:Go for Build':
      return 'PR Go for Build'
    case 'ADEO_Milestones:Go for Design&Conception':
      return 'PR Go for Design&Conception'
    case 'ADEO_Milestones:Go for Purchasing':
      return 'PR Go for Purchasing'
    case 'ADEO_Milestones:Go for Industrialisation':
      return 'PR Go for Industrialisation'
    case 'ADEO_Milestones:Go for Mass Prod':
      return 'PR Go for Mass Prod'
    case 'ADEO_Milestones:Go for Inhabitant':
      return 'PR Go for Inhabitant'
    case 'ADEO_Milestones:GO FOR ANALYSIS':
      return 'SL Go for Analysis'
    case 'ADEO_Milestones:GO FOR DEVELOPMENT':
      return 'SL Go for Development'
    case 'ADEO_Milestones:GO FOR PURCHASING':
      return 'SLGo for Purchasing'
    case 'ADEO_Milestones:GO FOR INDUSTRIALISATION':
      return 'SL Go for Industrialisation'
    case 'ADEO_Milestones:GO FOR MASS PRODUCTION':
      return 'SL Go for Mass Production'
    case 'ADEO_Milestones:GO ENDING':
      return 'SL Go Ending'
    case 'ADEO_Milestones:GO FOR INHABITANT':
      return 'SL Go for Inhabitant'
    default:
      return null
  }
}

const documentTypeConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_DocumentType:Other':
      return 'Other'
    case 'ADEO_DocumentType:Pre-Brief':
      return 'Pre-Brief'
    case 'ADEO_DocumentType:Brief':
      return 'Brief'
    case 'ADEO_DocumentType:Quality':
      return 'Quality'
    case 'ADEO_DocumentType:more_vertMatrix':
      return 'Matrix'
    case 'ADEO_DocumentType:Communication Brief':
      return 'Communication Brief'
    case 'ADEO_DocumentType:Communication and Manual Specifications':
      return 'Communication and Manual Specifications'
    case 'ADEO_DocumentType:Data Preanalysis Sheet':
      return 'Data Preanalysis Sheet (SL)'
    case 'ADEO_DocumentType:Data Preanalysis Sheet (for Go Ending)':
      return 'Data Preanalysis Sheet (SL Go Ending)'
    case 'ADEO_DocumentType:Design & Trends Specifications':
      return 'Design & Trends Specifications'
    case 'ADEO_DocumentType:Engineering Change Request':
      return 'Engineering Change Request (SL)'
    case 'ADEO_DocumentType:Functional Specification':
      return 'Functional Specification'
    case 'ADEO_DocumentType:Kick-Off Buying Offices':
      return 'Kick-Off Buying Offices'
    case 'ADEO_DocumentType:Kick-Off Project Minutes':
      return 'Kick-Off Project Minutes'
    case 'ADEO_DocumentType:Logistic Requirements':
      return 'Logistic Requirements'
    case 'ADEO_DocumentType:Macro-Planning':
      return 'Macro-Planning'
    case 'ADEO_DocumentType:Planning':
      return 'Micro-Planning'
    case 'ADEO_DocumentType:Packing Specifications':
      return 'Packing Specifications'
    case 'ADEO_DocumentType:Pre-Study':
      return 'Pre-Study'
    case 'ADEO_DocumentType:Previous Project Retex':
      return 'Previous Project Retex'
    case 'ADEO_DocumentType:Product Drawings':
      return 'Product Drawings'
    case 'ADEO_DocumentType:Quality Benchmark Report':
      return 'Quality Benchmark Report'
    case 'ADEO_DocumentType:Quality Requirements':
      return 'Quality Requirements'
    case 'ADEO_DocumentType:Risk Analysis':
      return 'Risk Analysis'
    case 'ADEO_DocumentType:Supplier Contract Tooling':
      return 'Supplier Contract Tooling (SL)'
    case 'ADEO_DocumentType:Supplier Evaluations':
      return 'Supplier Evaluations'
    case 'ADEO_DocumentType:Supply-Chain Specifications':
      return 'Supply-Chain Specifications'
    case 'ADEO_DocumentType:Technical Specification':
      return 'Technical Specification'
    case 'ADEO_DocumentType:Tender Follow-up':
      return 'Tender Follow-up'
    case 'ADEO_DocumentType:Import Document':
      return 'Import Document'
    case 'ADEO_DocumentType:Range Matrix':
      return 'Range Matrix'
    case 'ADEO_DocumentType:Kpi and Report':
      return 'Inhabitant Input report (concept / design)'
    case 'ADEO_DocumentType:Uses report':
      return 'Uses report'
    case 'ADEO_DocumentType:Product reviews published':
      return 'Club Testeur report (final product)'
    case 'ADEO_DocumentType:Inhabitant Usage test report sample validation':
      return 'Inhabitant Usage test report (silver sample validation)'
    case 'ADEO_DocumentType:Inhabitant Usage test report prototype validation':
      return 'Inhabitant Usage test report (prototype validation)'
    case 'ADEO_DocumentType:Inhabitant Media test report':
      return 'Inhabitant Media test report (360 media pack validation)'
    case 'ADEO_DocumentType:Quality Specifications':
      return 'Quality Specifications'
    case 'ADEO_DocumentType:Suppliers awarding':
      return 'Suppliers awarding'
  }
}

export default class ActivityMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      // milestone
      { apiField: '$id', aclField: 'id' },
      { apiField: 'responsible_party', rabbitMqField: 'ResponsibleParty', aclField: 'accountableUserId' },
      { apiField: 'adeo_calendar_activity_base_responsible_user_ref', rabbitMqField: 'ADEO_CalendarActivityBase_ResponsibleUser_Ref', aclField: 'accountableRoleId' },
      { apiField: 'adeo_calendar_activity_base_activity_index_int', rabbitMqField: 'adeo_CalendarActivityBase_ActivityIndex_int', aclField: 'index' },
      { apiField: 'node_name', rabbitMqField: 'Node Name', aclField: 'name' },
      { apiField: 'adeo_calendar_activity_base_long_desc_string', rabbitMqField: 'ADEO_CalendarActivityBase_LongDesc_String', aclField: 'details' },
      { apiField: 'adeo_calendar_activity_base_master_target_date_date', rabbitMqField: 'ADEO_CalendarActivityBase_MasterTargetDate_Date', aclField: 'initialDate' },
      { apiField: 'adeo_calendar_activity_base_revised_date_time', rabbitMqField: 'ADEO_CalendarActivityBase_RevisedDate_time', aclField: 'revisedDate' },
      { apiField: 'completion_date', rabbitMqField: 'CompletionDate', aclField: 'completionDate' },
      { apiField: 'adeo_calendar_activity_base_step_status_enum', rabbitMqField: 'ADEO_CalendarActivityBase_StepStatus_Enum', converter: stepStatusConverter, aclField: 'stepStatus' },
      { apiField: 'adeo_calendar_activity_base_step_type_enum', rabbitMqField: 'ADEO_CalendarActivityBase_StepType_Enum', converter: stepTypeConverter, aclField: 'stepType' },
      { apiField: 'adeo_calendar_activity_base_milestone_enum', rabbitMqField: 'ADEO_CalendarActivityBase_Milestone_Enum', converter: milestoneConverter, aclField: 'referenceMilestone' },
      // deliverable
      { apiField: 'adeo_calendar_activity_base_essential_deliverable_enum', rabbitMqField: 'ADEO_CalendarActivityBase_EssentialDeliverable_enum', converter: essentialDeliverableConverter, aclField: 'essentialDeliverable' },
      { apiField: 'adeo_calendar_activity_base_deliverable_type_enum', rabbitMqField: 'ADEO_CalendarActivityBase_DeliverableType_Enum', converter: documentTypeConverter, aclField: 'deliverableType' },
      { apiField: 'adeo_calendar_activity_base_deliverable_status_string', rabbitMqField: 'ADEO_CalendarActivityBase_DeliverableStatus_String', aclField: 'deliverableStatus' }

    ]
  }
}
