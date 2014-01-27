Package.describe({
      summary: "Easily create charts with Highcharts."
});

Package.on_use(function (api) {
    api.add_files('js/highstock.js', 'client');
});
