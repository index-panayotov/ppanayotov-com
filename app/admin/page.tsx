"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExperienceEntry } from "@/types";
import { LanguageProficiency } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Briefcase,
  Target,
  User,
  Loader2
} from "lucide-react";
import dynamic from "next/dynamic";
import * as handlers from "./handlers";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

// Dynamically import components that use browser-only APIs
const ExperiencesTab = dynamic(
  () => import("@/components/admin/experiences-tab"),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> }
);
const TopSkillsTab = dynamic(
  () => import("@/components/admin/top-skills-tab"),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> }
);
const ProfileDataTab = dynamic(
  () => import("@/components/admin/profile-data-tab"),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> }
);
const ExperienceDialog = dynamic(
  () => import("@/components/admin/experience-dialog"),
  { ssr: false }
);
const LanguageDialog = dynamic(
  () => import("@/components/admin/language-dialog"),
  { ssr: false }
);
const EducationDialog = dynamic(
  () => import("@/components/admin/education-dialog"),
  { ssr: false }
);
const CertificationDialog = dynamic(
  () => import("@/components/admin/certification-dialog"),
  { ssr: false }
);
const SocialLinkDialog = dynamic(
  () => import("@/components/admin/social-link-dialog"),
  { ssr: false }
);

export default function AdminPage() {
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [topSkills, setTopSkills] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<any>({
    name: "",
    title: "",
    location: "",
    email: "",
    linkedin: "",
    profileImageUrl: "",
    profileImageWebUrl: "",
    profileImagePdfUrl: "",
    summary: "",
    languages: [],
    education: [],
    certifications: []
  });
  const [isDev, setIsDev] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side detection and navigation state
  const [isClient, setIsClient] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<"visual" | "json">("visual");
  const [activeTab, setActiveTab] = useState("dashboard");

  const searchParams = useSearchParams();
  const router = useRouter();

  // Dialog states
  const [currentExperience, setCurrentExperience] = useState<ExperienceEntry | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<{
    name: string;
    proficiency: LanguageProficiency;
    _index?: number;
  } | null>(null);
  const [currentEducation, setCurrentEducation] = useState<{
    institution: string;
    degree: string;
    field: string;
    dateRange: string;
    _index?: number;
  } | null>(null);
  const [currentCertification, setCurrentCertification] = useState<{
    name: string;
    issuer?: string;
    date?: string;
    _index?: number;
  } | null>(null);
  const [socialLinkDialogOpen, setSocialLinkDialogOpen] = useState(false);
  const [currentSocialLink, setCurrentSocialLink] = useState<{
    platform: string;
    url: string;
    label?: string;
    visible: boolean;
    visibleInHero: boolean;
    position: number;
    _index?: number;
  } | null>(null);

  const { toast } = useToast();

  // Client-side detection effect
  useEffect(() => {
    setIsClient(true);
  }, []);

  // URL parameter listening effect for tab switching
  useEffect(() => {
    if (!isClient) return;

    const currentTab = searchParams?.get('tab');
    if (currentTab && ['dashboard', 'experiences', 'topSkills', 'profileData'].includes(currentTab)) {
      setActiveTab(currentTab);
    } else {
      setActiveTab('dashboard');
    }
  }, [searchParams, isClient]);

  // Data loading effect
  useEffect(() => {
    const checkEnv = async () => {
      try {
        setLoading(true);
        console.log('[Admin Page] Starting data load...');

        // Check if user is authenticated
        const isAuthenticated = document.cookie.includes(
          "admin_authenticated=true"
        );
        console.log('[Admin Page] Authenticated:', isAuthenticated);

        if (!isAuthenticated) {
          console.log('[Admin Page] Not authenticated, redirecting to login');
          router.push("/admin/login");
          return;
        }

        console.log('[Admin Page] Fetching admin data from /api/admin');
        const res = await fetch("/api/admin");
        console.log('[Admin Page] Response status:', res.status);

        if (res.status === 403) {
          console.error('[Admin Page] Forbidden - not in dev mode');
          setIsDev(false);
          setError("Admin panel is only available in development mode");
          return;
        }

        if (!res.ok) {
          console.error('[Admin Page] Response not OK:', res.statusText);
          throw new Error(`Failed to fetch data: ${res.statusText}`);
        }

        const data = await res.json();
        console.log('[Admin Page] Data received:', {
          hasProfileData: !!data.profileData,
          experiencesCount: data.experiences?.length,
          topSkillsCount: data.topSkills?.length
        });

        // Normalize data (API now returns profileData consistently)
        const profile = data.profileData || {
          name: "",
          title: "",
          location: "",
          email: "",
          phone: "",
          profileImageUrl: "",
          summary: "",
          languages: [],
          education: [],
          certifications: [],
          socialLinks: []
        };

        console.log('[Admin Page] Setting state with profile:', profile.name);
        setExperiences(data.experiences || []);
        setTopSkills(data.topSkills || []);
        setProfileData(profile);
        setIsDev(true);
        setError(null);
        console.log('[Admin Page] ✓ Data loaded successfully');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Admin Page] Error loading data:', errorMsg, err);
        setError(
          `Error loading data: ${errorMsg}. Make sure you are in development mode.`
        );
      } finally {
        setLoading(false);
      }
    };

    checkEnv();
  }, [router]);

  // Handler functions (keeping all the existing handlers)
  const handleSave = async (file: string, data: any) => {
    return handlers.handleSave(file, data, setSaving, toast);
  };

  const handleExperiencesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handlers.handleExperiencesChange(e, setExperiences);
  };

  const handleTopSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handlers.handleTopSkillsChange(e, setTopSkills);
  };

  const handleProfileDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handlers.handleProfileDataChange(e, setProfileData);
  };

  const handleProfileFieldChange = (field: string, value: string) => {
    handlers.handleProfileFieldChange(field, value, profileData, setProfileData);
  };

  const addExperience = () => {
    handlers.addExperience(setCurrentExperience, setDialogOpen);
  };

  const editExperience = (exp: ExperienceEntry, index: number) => {
    handlers.editExperience(exp, index, setCurrentExperience, setDialogOpen);
  };

  const saveExperience = () => {
    handlers.saveExperience(
      currentExperience,
      experiences,
      setExperiences,
      setDialogOpen,
      setCurrentExperience,
      setNewSkill,
      setSaving,
      toast
    );
  };

  const deleteExperience = (index: number) => {
    handlers.deleteExperience(index, experiences, setExperiences, toast);
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    handlers.moveExperience(index, direction, experiences, setExperiences, setSaving, toast);
  };

  const addTag = () => {
    handlers.addTag(currentExperience, newSkill, setCurrentExperience, setNewSkill);
  };

  const removeTag = (tag: string) => {
    handlers.removeTag(tag, currentExperience, setCurrentExperience);
  };

  const addTopSkill = () => {
    handlers.addTopSkill(newSkill, topSkills, setTopSkills, setNewSkill, toast);
  };

  const removeTopSkill = (skill: string) => {
    handlers.removeTopSkill(skill, topSkills, setTopSkills, toast);
  };

  const moveTopSkill = (index: number, direction: "up" | "down") => {
    handlers.moveTopSkill(index, direction, topSkills, setTopSkills);
  };

  const generateAutomaticTopSkills = async () => {
    handlers.generateAutomaticTopSkills(experiences, setTopSkills, setSaving, toast);
  };

  const addLanguage = () => {
    handlers.addLanguage(setCurrentLanguage, setLanguageDialogOpen);
  };

  const editLanguage = (lang: any, index: number) => {
    handlers.editLanguage(lang, index, setCurrentLanguage, setLanguageDialogOpen);
  };

  const saveLanguage = () => {
    handlers.saveLanguage(
      currentLanguage,
      profileData,
      setProfileData,
      setLanguageDialogOpen,
      setCurrentLanguage,
      toast
    );
  };

  const deleteLanguage = (index: number) => {
    handlers.deleteLanguage(index, profileData, setProfileData, toast);
  };

  const moveLanguage = (index: number, direction: "up" | "down") => {
    handlers.moveLanguage(index, direction, profileData, setProfileData);
  };

  const addEducation = () => {
    handlers.addEducation(setCurrentEducation, setEducationDialogOpen);
  };

  const editEducation = (edu: any, index: number) => {
    handlers.editEducation(edu, index, setCurrentEducation, setEducationDialogOpen);
  };

  const saveEducation = () => {
    handlers.saveEducation(
      currentEducation,
      profileData,
      setProfileData,
      setEducationDialogOpen,
      setCurrentEducation,
      toast
    );
  };

  const deleteEducation = (index: number) => {
    handlers.deleteEducation(index, profileData, setProfileData, toast);
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    handlers.moveEducation(index, direction, profileData, setProfileData);
  };

  const addCertification = () => {
    handlers.addCertification(setCurrentCertification, setCertificationDialogOpen);
  };

  const editCertification = (cert: any, index: number) => {
    handlers.editCertification(cert, index, setCurrentCertification, setCertificationDialogOpen);
  };

  const saveCertification = () => {
    handlers.saveCertification(
      currentCertification,
      profileData,
      setProfileData,
      setCertificationDialogOpen,
      setCurrentCertification,
      toast
    );
  };

  const deleteCertification = (index: number) => {
    handlers.deleteCertification(index, profileData, setProfileData, toast);
  };

  const moveCertification = (index: number, direction: "up" | "down") => {
    handlers.moveCertification(index, direction, profileData, setProfileData);
  };

  const addSocialLink = () => {
    handlers.addSocialLink(setCurrentSocialLink, setSocialLinkDialogOpen, profileData);
  };

  const editSocialLink = (link: any, index: number) => {
    handlers.editSocialLink(link, index, setCurrentSocialLink, setSocialLinkDialogOpen);
  };

  const saveSocialLink = () => {
    handlers.saveSocialLink(
      currentSocialLink,
      profileData,
      setProfileData,
      setSocialLinkDialogOpen,
      setCurrentSocialLink,
      setSaving,
      toast
    );
  };

  const deleteSocialLink = (index: number) => {
    handlers.deleteSocialLink(index, profileData, setProfileData, setSaving, toast);
  };

  const moveSocialLink = (index: number, direction: "up" | "down") => {
    handlers.moveSocialLink(index, direction, profileData, setProfileData, setSaving, toast);
  };

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'dashboard') {
      router.push('/admin');
    } else {
      router.push(`/admin?tab=${value}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isDev) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Development Mode Only</AlertTitle>
          <AlertDescription>
            The admin panel is only available in development mode. Please run
            the application in development mode to access this feature.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
        {/* Prominent Tab Navigation */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">CV Admin Panel</h1>
              <p className="text-sm text-slate-600 mt-1">Manage your professional CV content</p>
            </div>
            {saving && (
              <Badge variant="secondary" className="gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </Badge>
            )}
          </div>

          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b-0 gap-1">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-t-md px-4 py-3 gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="experiences"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-t-md px-4 py-3 gap-2"
            >
              <Briefcase className="h-4 w-4" />
              Experiences
              <Badge variant="secondary" className="ml-1 text-xs">
                {experiences.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="topSkills"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-t-md px-4 py-3 gap-2"
            >
              <Target className="h-4 w-4" />
              Top Skills
              <Badge variant="secondary" className="ml-1 text-xs">
                {topSkills.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="profileData"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-t-md px-4 py-3 gap-2"
            >
              <User className="h-4 w-4" />
              Profile Data
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
          <TabsContent value="dashboard" className="m-0 p-6">
            <AdminDashboard
              experiences={experiences}
              topSkills={topSkills}
              profileData={profileData}
            />
          </TabsContent>

          <TabsContent value="experiences" className="m-0 p-6">
            <ExperiencesTab
              experiences={experiences}
              setExperiences={setExperiences}
              editMode={editMode}
              setEditMode={setEditMode}
              saving={saving}
              handleSave={handleSave}
              handleExperiencesChange={handleExperiencesChange}
              addExperience={addExperience}
              editExperience={editExperience}
              deleteExperience={deleteExperience}
              moveExperience={moveExperience}
            />
          </TabsContent>

          <TabsContent value="topSkills" className="m-0 p-6">
            <TopSkillsTab
              topSkills={topSkills}
              setTopSkills={setTopSkills}
              editMode={editMode}
              setEditMode={setEditMode}
              saving={saving}
              handleSave={handleSave}
              handleTopSkillsChange={handleTopSkillsChange}
              addTopSkill={addTopSkill}
              removeTopSkill={removeTopSkill}
              moveTopSkill={moveTopSkill}
              generateAutomaticTopSkills={generateAutomaticTopSkills}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
            />
          </TabsContent>

          <TabsContent value="profileData" className="m-0 p-6">
            <ProfileDataTab
              profileData={profileData}
              setProfileData={setProfileData}
              editMode={editMode}
              setEditMode={setEditMode}
              saving={saving}
              handleSave={handleSave}
              handleProfileDataChange={handleProfileDataChange}
              handleProfileFieldChange={handleProfileFieldChange}
              addLanguage={addLanguage}
              editLanguage={editLanguage}
              deleteLanguage={deleteLanguage}
              moveLanguage={moveLanguage}
              addEducation={addEducation}
              editEducation={editEducation}
              deleteEducation={deleteEducation}
              moveEducation={moveEducation}
              addCertification={addCertification}
              editCertification={editCertification}
              deleteCertification={deleteCertification}
              moveCertification={moveCertification}
              addSocialLink={addSocialLink}
              editSocialLink={editSocialLink}
              deleteSocialLink={deleteSocialLink}
              moveSocialLink={moveSocialLink}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Dialogs */}
      <ExperienceDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        currentExperience={currentExperience}
        setCurrentExperience={setCurrentExperience}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        addTag={addTag}
        removeTag={removeTag}
        saveExperience={saveExperience}
        saving={saving}
      />
      <LanguageDialog
        open={languageDialogOpen}
        setOpen={setLanguageDialogOpen}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        saveLanguage={saveLanguage}
      />
      <EducationDialog
        open={educationDialogOpen}
        setOpen={setEducationDialogOpen}
        currentEducation={currentEducation}
        setCurrentEducation={setCurrentEducation}
        saveEducation={saveEducation}
      />
      <CertificationDialog
        open={certificationDialogOpen}
        setOpen={setCertificationDialogOpen}
        currentCertification={currentCertification}
        setCurrentCertification={setCurrentCertification}
        saveCertification={saveCertification}
      />
      <SocialLinkDialog
        open={socialLinkDialogOpen}
        setOpen={setSocialLinkDialogOpen}
        currentSocialLink={currentSocialLink}
        setCurrentSocialLink={setCurrentSocialLink}
        saveSocialLink={saveSocialLink}
        saving={saving}
      />
    </div>
  );
}
