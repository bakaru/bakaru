require('./prepare').then(() => require('./win')).catch(e => console.error(e, e.stack));
