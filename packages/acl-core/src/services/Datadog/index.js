/**
 * @module services/Datadog
 * @description Core service to manage interaction with Datadog.
 * @requires module:dd-trace
 * @requires module:hot-shots
 * @requires module:services/Logger
 */

import tracer from 'dd-trace'
import StatsD from 'hot-shots'

import Logger from '../Logger'
import utils from '../../utils/index'

import { SERVICE_NAME, METRICS_PREFIX, CUSTOM_METRICS_PREFIX, MISSING_STREAM_INFORMATION_MESSAGE } from './constants'

// Init the DataDog tracer using the default env variables.
tracer.init()

// Init the DogStatD client to log custom metrics.
const StatsDClient = new StatsD({
  globalTags: { env: process.env.NODE_ENV }
})

/**
 * Format the metric name.
 *
 * @param {object} pluginInfos - Plugin infos.
 * @param {string} pluginInfos.stream - Calling plugin stream name.
 * @param {string} metricName - Metric name.
 * @returns {string} - Formated metric name.
 */
const formatMetricName = (pluginInfos, metricName) => {
  // Regex to replace all the _ by -
  return (`${METRICS_PREFIX}.${process.env.PROJECT_TANGRAM}.${pluginInfos.stream}.` + metricName).replace(/-/g, '_').toLowerCase()
}

/**
 * Increment a Datadog metric.
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.stream - Calling plugin stream name.
 * @param {string} metricName - Name of the metric to increment.
 * @param {number} value - Amount of the increment.
 * @param {Array} tags - Array of tags
 */
const incrementMetric = (pluginInfos, metricName, value, tags = []) => {
  const logInfos = utils.generateLogInfos(pluginInfos, { labels: { service: SERVICE_NAME } })
  if (pluginInfos.stream) {
    const newMetricName = formatMetricName(pluginInfos, metricName)
    StatsDClient.increment(newMetricName, value, tags)
  } else {
    Logger.warn(`Datadog.incrementMetric(): ${MISSING_STREAM_INFORMATION_MESSAGE}`, logInfos)
  }
}

/**
 * Increment a Datadog custom metric.
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.stream - Calling plugin stream name.
 * @param {string} metricName - Name of the metric to increment.
 * @param {number} value - Amount of the increment.
 * @param {Array} tags - Array of tags
 */
const incrementCustomMetric = (pluginInfos, metricName, value, tags = []) => {
  incrementMetric(CUSTOM_METRICS_PREFIX + '_' + metricName, value, pluginInfos, tags)
}

/**
 * Gauge a Datadog metric.
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.stream - Calling plugin stream name.
 * @param {string} metricName Name of the metric to increment
 * @param {number} value Amount of the increment
 * @param {Array} tags - Array of tags
 */
const gaugeMetric = (pluginInfos, metricName, value, tags = []) => {
  const logInfos = utils.generateLogInfos(pluginInfos, { labels: { service: SERVICE_NAME } })
  if (pluginInfos?.stream) {
    const newMetricName = formatMetricName(pluginInfos, metricName)
    StatsDClient.gauge(newMetricName, value, tags)
  } else {
    Logger.warn(`Datadog.gaugeMetric(): ${MISSING_STREAM_INFORMATION_MESSAGE}`, logInfos)
  }
}

/**
 * Gauge a Datadog custom metric.
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.stream - Calling plugin stream name.
 * @param {string} metricName Name of the metric to increment
 * @param {number} value Amount of the increment
 * @param {Array} tags - Array of tags
 */
const gaugeCustomMetric = (pluginInfos, metricName, value, tags = []) => {
  gaugeMetric(CUSTOM_METRICS_PREFIX + '_' + metricName, value, pluginInfos, tags)
}

export default { incrementCustomMetric, incrementMetric, gaugeMetric, gaugeCustomMetric }
