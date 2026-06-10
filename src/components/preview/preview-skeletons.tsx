"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("shimmer-card rounded-md", className)} />
  );
}

export function LandingPageSkeleton() {
  return (
    <div className="w-full h-full bg-[#0a0a0a] text-white flex flex-col p-4 overflow-y-auto space-y-8 select-none">
      {/* Navbar Skeleton */}
      <div className="flex items-center justify-between py-3 px-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="w-12 h-2 rounded hidden sm:block" />
          <Skeleton className="w-12 h-2 rounded hidden sm:block" />
          <Skeleton className="w-12 h-2 rounded hidden sm:block" />
        </div>
        <Skeleton className="w-16 h-7 rounded-lg" />
      </div>

      {/* Hero Section Skeleton */}
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 space-y-4 max-w-xl mx-auto w-full">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-full h-10 rounded-lg" />
        <Skeleton className="w-3/4 h-10 rounded-lg" />
        <div className="pt-2 w-full space-y-2">
          <Skeleton className="w-full h-3 rounded" />
          <Skeleton className="w-5/6 h-3 rounded mx-auto" />
        </div>
        <div className="flex gap-3 pt-4 justify-center">
          <Skeleton className="w-24 h-9 rounded-lg" />
          <Skeleton className="w-24 h-9 rounded-lg" />
        </div>
      </div>

      {/* Features Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 max-w-4xl mx-auto w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-white/5 bg-[#111111] p-5 rounded-xl space-y-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-24 h-4 rounded" />
            <div className="space-y-1.5 pt-1">
              <Skeleton className="w-full h-2 rounded" />
              <Skeleton className="w-full h-2 rounded" />
              <Skeleton className="w-2/3 h-2 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section Skeleton */}
      <div className="px-4 max-w-4xl mx-auto w-full pb-8">
        <div className="border border-white/5 bg-[#111111] p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
          <Skeleton className="w-48 h-6 rounded" />
          <Skeleton className="w-64 h-3 rounded" />
          <div className="flex gap-2 w-full max-w-xs pt-2">
            <Skeleton className="flex-1 h-9 rounded-lg" />
            <Skeleton className="w-20 h-9 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="w-full h-full bg-[#0a0a0a] text-white flex p-0 overflow-hidden select-none">
      {/* Sidebar Skeleton */}
      <div className="w-48 border-r border-white/5 bg-[#0f0f11] p-4 flex flex-col space-y-6 shrink-0 hidden sm:flex">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="w-20 h-3 rounded" />
        </div>
        <div className="space-y-3 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2.5 py-1">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="w-20 h-2.5 rounded" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-4 border-t border-white/5">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-16 h-2 rounded" />
        </div>
      </div>

      {/* Main Panel Skeleton */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="space-y-1.5">
            <Skeleton className="w-32 h-5 rounded" />
            <Skeleton className="w-48 h-2 rounded" />
          </div>
          <Skeleton className="w-24 h-8 rounded-lg" />
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-white/5 bg-[#111111] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="w-16 h-2.5 rounded" />
                <Skeleton className="w-4 h-4 rounded" />
              </div>
              <Skeleton className="w-20 h-6 rounded" />
              <Skeleton className="w-24 h-2 rounded" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="border border-white/5 bg-[#111111] rounded-xl overflow-hidden flex-1 min-h-[200px]">
          <div className="border-b border-white/5 p-4 flex items-center justify-between">
            <Skeleton className="w-24 h-4 rounded" />
            <Skeleton className="w-12 h-6 rounded" />
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <Skeleton className="w-1/4 h-3 rounded" />
              <Skeleton className="w-1/6 h-3 rounded" />
              <Skeleton className="w-1/6 h-3 rounded" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <Skeleton className="w-1/3 h-2.5 rounded" />
                <Skeleton className="w-12 h-2.5 rounded" />
                <Skeleton className="w-16 h-5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
