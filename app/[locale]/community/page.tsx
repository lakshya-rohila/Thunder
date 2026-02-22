"use client";

import React from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import CommunityFeed from "@/modules/Community/CommunityFeed";

export default function Community() {
  return (
    <div className="h-screen flex flex-col bg-[#0B0F19] text-white overflow-hidden">
      <DashboardNavbar />
      <CommunityFeed />
    </div>
  );
}
