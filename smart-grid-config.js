var smartgrid = require('smart-grid');

/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '16px', /* gutter width px || % || rem */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1000px', /* max-width оn very large screen */
        fields: '20px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '960px', /* -> @media (max-width: 1100px) */
        },
        md: {
            width: '780px'
        },
        sm: {
            width: '540px',
            fields: '10px' /* set fields only if you want to change container.fields */
        },
        xs: {
            width: '320px'
        }
        /* 
        We can create any quantity of break points.

        some_name: {
            width: 'Npx',
            fields: 'N(px|%|rem)',
            offset: 'N(px|%|rem)'
        }
        */
    }
};

smartgrid('./src/scss/libs/', settings);