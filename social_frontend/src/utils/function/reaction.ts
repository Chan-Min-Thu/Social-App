import type { Reaction } from "../../types/reaction.type";
import { Heart, Angry, Frown, Laugh, ThumbsUp } from "lucide-react";
// import type { ForwardRefExoticComponent, RefAttributes } from "react";
export const reactionFun = (type: Reaction) => {
  const renderStatus = () => {
    switch (type) {
      case "LIKE":
        return ThumbsUp;
      case "LOVE":
        return Heart;
      case "HAHA":
        return Laugh;
      case "SAD":
        return Frown;
      case "ANGRY":
        return Angry;
      default:
        return ThumbsUp;
    }
  };
  renderStatus();
};

// import React from 'react';
// // Import necessary Lucide React icons
// import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

// const StatusIndicator = ({ status }) => {
//   const renderStatus = () => {
//     switch (status) {
//       case 'processing':
//         return (
//           <div className="flex items-center text-blue-500">
//             <Package className="w-5 h-5 mr-2" />
//             <span>Processing</span>
//           </div>
//         );
//       case 'shipped':
//         return (
//           <div className="flex items-center text-indigo-500">
//             <Truck className="w-5 h-5 mr-2" />
//             <span>Shipped</span>
//           </div>
//         );
//       case 'delivered':
//         return (
//           <div className="flex items-center text-green-500">
//             <CheckCircle className="w-5 h-5 mr-2" />
//             <span>Delivered</span>
//           </div>
//         );
//       case 'cancelled':
//         return (
//           <div className="flex items-center text-red-500">
//             <XCircle className="w-5 h-5 mr-2" />
//             <span>Cancelled</span>
//           </div>
//         );
//       default:
//         return (
//           <div className="flex items-center text-gray-500">
//             <Clock className="w-5 h-5 mr-2" />
//             <span>Pending</span>
//           </div>
//         );
//     }
//   };

//   return <div className="status-container">{renderStatus()}</div>;
// };

// Example Usage in a Parent Component:
// const App = () => {
//   return (
//     <div>
//       <StatusIndicator status="shipped" />
//       <StatusIndicator status="delivered" />
//       <StatusIndicator status="unknown" />
//     </div>
//   );
// };

// export default App;
