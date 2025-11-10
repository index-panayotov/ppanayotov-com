"use client";

import { useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Target,
  User,
  Globe,
  Clock,
  Plus,
  BarChart3,
  Brain
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminDashboardProps, DashboardStats, QuickAction } from "@/types/admin";

export function AdminDashboard({ experiences, topSkills, profileData }: AdminDashboardProps) {
  const router = useRouter();

  // Memoized statistics calculation
  const stats = useMemo<DashboardStats>(() => {
    // Calculate total words from experiences and summary
    const totalWords = experiences.reduce((acc, exp) => {
      return acc + (exp.description?.split(' ').length || 0);
    }, 0) + (profileData.summary?.split(' ').length || 0);

    return {
      experiences: experiences.length,
      topSkills: topSkills.length,
      languages: profileData.languages?.length || 0,
      education: profileData.education?.length || 0,
      certifications: profileData.certifications?.length || 0,
      lastUpdated: new Date().toISOString(),
      totalWords
    };
  }, [experiences, topSkills, profileData]);

  // Memoized navigation handlers - updated for page-based navigation
  const handleNavigation = useCallback((tab: string) => {
    const pathMap: Record<string, string> = {
      dashboard: '/admin/dashboard',
      experiences: '/admin/experiences',
      topSkills: '/admin/top-skills',
      profileData: '/admin/profile-data',
      settings: '/admin/settings'
    };
    router.push(pathMap[tab] || '/admin/dashboard');
  }, [router]);

  // Memoized quick actions
  const quickActions = useMemo<QuickAction[]>(() => [
    {
      title: "Add Experience",
      description: "Add new work experience",
      icon: Plus,
      action: () => handleNavigation("experiences"),
      color: "bg-blue-600"
    },
    {
      title: "Manage Skills",
      description: "Update top skills",
      icon: Target,
      action: () => handleNavigation("topSkills"),
      color: "bg-green-600"
    },
    {
      title: "Edit Profile",
      description: "Update personal info",
      icon: User,
      action: () => handleNavigation("profileData"),
      color: "bg-purple-500"
    },
    {
      title: "AI Enhance",
      description: "Improve content with AI",
      icon: Brain,
      action: () => handleNavigation("experiences"),
      color: "bg-blue-500"
    }
  ], [handleNavigation]);



  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Welcome to your Dashboard!</h1>
        <p className="text-lg text-slate-600 mt-2">Here's a quick overview of your CV content and quick actions.</p>
      </div>

      {/* Stats Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Overview Statistics</CardTitle>
          <CardDescription>Key metrics about your CV content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="group cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => handleNavigation('experiences')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">Experiences</CardTitle>
                <Briefcase className="h-6 w-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-900">{stats.experiences}</div>
                <p className="text-sm text-slate-500 mt-1">Work experiences</p>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => handleNavigation('topSkills')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 group-hover:text-green-600 transition-colors">Top Skills</CardTitle>
                <Target className="h-6 w-6 text-green-500 group-hover:text-green-600 transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-900">{stats.topSkills}</div>
                <p className="text-sm text-slate-500 mt-1">Featured skills</p>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900 group-hover:text-blue-700 transition-colors">Total Words</CardTitle>
                <BarChart3 className="h-6 w-6 text-blue-500 group-hover:text-blue-700 transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-900">{stats.totalWords.toLocaleString()}</div>
                <p className="text-sm text-blue-700 mt-1">Content words</p>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => handleNavigation('profileData')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors">Languages</CardTitle>
                <Globe className="h-6 w-6 text-purple-500 group-hover:text-purple-600 transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-900">{stats.languages}</div>
                <p className="text-sm text-slate-500 mt-1">Known languages</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your CV content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex flex-col items-center gap-3 p-5 rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group hover:scale-[1.02] hover:shadow-md"
                >
                  <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-base text-slate-900">{action.title}</div>
                    <div className="text-sm text-slate-500 mt-1">{action.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">



      </div>
    </div>
  );
}