// import React, { createContext, useState } from "react";

// export const ProductContext = createContext();

// export const ProductProvider = ({ children }) => {
//   const [products, setProducts] = useState([]);

//   const addItem = (product) => {
//     setProducts((prevProducts) => [...prevProducts, product]);
//   };

//   return (
//     <ProductContext.Provider value={{ products, addItem }}>
//       {children}
//     </ProductContext.Provider>
//   );
// };