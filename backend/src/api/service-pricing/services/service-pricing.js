'use strict';

/**
 * service-pricing service
 */

const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::service-pricing.service-pricing');
