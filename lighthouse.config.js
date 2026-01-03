module.exports = {
  extends: 'lighthouse:default',
  settings: {
    budgets: [{
      path: '/*',
      resourceCounts: [
        { resourceType: 'script', budget: 5 },
        { resourceType: 'image', budget: 10 }
      ],
      timings: [
        { metric: 'interactive', budget: 3000 }
      ]
    }]
  }
};
