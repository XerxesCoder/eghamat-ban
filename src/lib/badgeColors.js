export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-cyan-100 text-cyan-800";
    case "outdated":
      return "bg-gray-300 text-gray-800";
    case "ended":
      return "bg-red-100 text-red-800 animate-pulse";
    case "checked_in":
      return "bg-purple-100 text-purple-800 animate-pulse";
    case "stay":
      return "bg-lime-100 text-lime-800 animate-pulse";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
