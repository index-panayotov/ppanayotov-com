"use client";

import { useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Target, 
  User, 
  Globe,
  TrendingUp,
  Clock,
  Plus,
  BarChart3,
  Brain
} from "lucide-react";
import { adminColors } from './design-system';
import { useRouter } from "next/navigation";
import { AdminDashboardProps, DashboardStats, QuickAction, ActivityItem } from "@/types/admin";
import { AdminPageHeader } from "./ui/admin-page-header";
import { AdminCard, AdminCardHeader, AdminCardContent } from "./ui/admin-card";
import { AdminButton } from "./ui/admin-button";
import { adminClassNames } from "./design-system";
import { cn } from "@/lib/utils";

export function AdminDashboard({ experiences, topSkills, profileData }: AdminDashboardProps) {
  const router = useRouter();

  // Memoized statistics calculation
  const stats = useMemo<DashboardStats>(() => {
    // Calculate total words from experiences and summary
    const totalWords = experiences.reduce((acc, exp) => {
      return acc + (exp.description?.split(' ').length || 0);
    }, 0) + (profileData.summary?.split(' ').length || 0);

    // Calculate completion score using weighted criteria
    let completionScore = 0;
    if (profileData.name) completionScore += 10;
    if (profileData.title) completionScore += 10;
    if (profileData.summary) completionScore += 15;
    if (profileData.email) completionScore += 5;
    if (profileData.linkedin) completionScore += 5;
    if (experiences.length > 0) completionScore += 20;
    if (topSkills.length > 0) completionScore += 15;
    if (profileData.languages?.length > 0) completionScore += 10;
    if (profileData.education?.length > 0) completionScore += 10;

    return {
      experiences: experiences.length,
      topSkills: topSkills.length,
      languages: profileData.languages?.length || 0,
      education: profileData.education?.length || 0,
      certifications: profileData.certifications?.length || 0,
      lastUpdated: new Date().toISOString(),
      totalWords,
      completionScore: Math.min(100, completionScore)
    };
  }, [experiences, topSkills, profileData]);

  // Memoized navigation handlers
  const handleNavigation = useCallback((tab: string) => {
    router.push(tab === 'dashboard' ? '/admin' : `/admin?tab=${tab}`);
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
      color: "bg-orange-500"
    }
  ], [handleNavigation]);

  // Memoized recent activity (placeholder data - in real app would come from props)
  const recentActivity = useMemo<ActivityItem[]>(() => [
    { action: "Updated experience at TechCorp", time: "2 hours ago", type: "experience" },
    { action: "Added new skill: React", time: "1 day ago", type: "skill" },
    { action: "Enhanced summary with AI", time: "3 days ago", type: "ai" },
    { action: "Added certification", time: "1 week ago", type: "certification" }
  ], []);

  return (
    <div className={adminClassNames.layout.pageContainer}>
      {/* Header */}
      <AdminPageHeader
        title="Dashboard"
        description="Manage your professional CV content"
        actions={
          <Badge 
            variant={stats.completionScore >= 80 ? "default" : "secondary"}
            className="text-sm px-3 py-1"
          >
            {stats.completionScore}% Complete
          </Badge>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experiences</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.experiences}</div>
            <p className="text-xs text-muted-foreground">Work experiences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topSkills}</div>
            <p className="text-xs text-muted-foreground">Featured skills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Words</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Content words</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.languages}</div>
            <p className="text-xs text-muted-foreground">Known languages</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <AdminCard variant="base">
        <AdminCardHeader
          title="Quick Actions"
          description="Common tasks to manage your CV content"
        />
        <AdminCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <AdminButton
                  key={index}
                  variant="secondary"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={action.action}
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className={cn(adminClassNames.text.caption)}>{action.description}</div>
                  </div>
                </AdminButton>
              );
            })}
          </div>
        </AdminCardContent>
      </AdminCard>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Content Completion
            </CardTitle>
            <CardDescription>
              Track your CV completeness
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{stats.completionScore}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.completionScore}%` }}
                />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Basic Info</span>
                <Badge variant={profileData.name && profileData.title ? "default" : "secondary"}>
                  {profileData.name && profileData.title ? "Complete" : "Incomplete"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Experiences</span>
                <Badge variant={stats.experiences > 0 ? "default" : "secondary"}>
                  {stats.experiences} entries
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Skills</span>
                <Badge variant={stats.topSkills > 0 ? "default" : "secondary"}>
                  {stats.topSkills} skills
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest changes to your CV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <div>{activity.action}</div>
                    <div className="text-muted-foreground text-xs">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}