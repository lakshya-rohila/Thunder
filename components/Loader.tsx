import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-300">
        Generating Component...
      </span>
    </div>
  );
}
