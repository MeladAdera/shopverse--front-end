// // 📁 hooks/useURLFilters.ts (مبسط جداً)
// import { useSearchParams } from "react-router-dom";

// export const useURLFilters = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   // تحديث فلتر واحد
//   const updateFilter = (key: string, value: string | null) => {
//     setSearchParams(prev => {
//       const newParams = new URLSearchParams(prev.toString());
      
//       if (value) {
//         newParams.set(key, value);
//       } else {
//         newParams.delete(key);
//       }
      
//       return newParams;
//     });
//   };

//   // تحديث عدة فلاتر مرة واحدة
//   const updateFilters = (filters: Record<string, string | null>) => {
//     setSearchParams(prev => {
//       const newParams = new URLSearchParams(prev.toString());
      
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value) {
//           newParams.set(key, value);
//         } else {
//           newParams.delete(key);
//         }
//       });
      
//       return newParams;
//     });
//   };

//   // قراءة فلتر
//   const getFilter = (key: string) => {
//     return searchParams.get(key);
//   };

//   // قراءة جميع الفلاتر
//   const getAllFilters = () => {
//     const filters: Record<string, string> = {};
    
//     for (const [key, value] of searchParams.entries()) {
//       filters[key] = value;
//     }
    
//     return filters;
//   };

//   // مسح جميع الفلاتر
//   const clearAllFilters = () => {
//     setSearchParams(new URLSearchParams());
//   };

//   // هل هناك فلاتر؟
//   const hasFilters = searchParams.toString().length > 0;

//   return {
//     searchParams,
//     setSearchParams,
//     updateFilter,
//     updateFilters,
//     getFilter,
//     getAllFilters,
//     clearAllFilters,
//     hasFilters
//   };
// };