'use strict';

/**
 * blog-portfolio service
 */

const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::blog-portfolio.blog-portfolio');
