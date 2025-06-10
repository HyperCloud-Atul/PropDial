// import React from 'react'

// export default function NumberFormat() {
//     const numberFormat = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "INR",
//     });
//     return (
//         <div>

//         </div>
//     )
// }

const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
});

export { numberFormat }
