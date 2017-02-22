'use strict';

module.exports = {
  getLocationCodes: function() {
    var locationCodes = [];
    var sql = "SELECT DISTINCT id2 " +
      "FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy " +
      "WHERE id2 IS NOT NULL " +
      "ORDER BY id2;";
    var jQueryPromise = $.getJSON('https://becexplorer.cartodb.com/api/v2/sql?q=' + sql);
    return Promise.resolve(jQueryPromise);
  }
};