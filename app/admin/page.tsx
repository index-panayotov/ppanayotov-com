"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExperienceEntry } from "@/types";
import { LanguageProficiency } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import * as handlers from "./handlers";

// Dynamically import components that use browser-only APIs
const ExperiencesTab = dynamic(
  () => import("@/components/admin/experiences-tab"),
  { ssr: false }
);
const TopSkillsTab = dynamic(
  () => import("@/components/admin/top-skills-tab"),
  { ssr: false }
);
const ProfileDataTab = dynamic(
  () => import("@/components/admin/profile-data-tab"),
  { ssr: false }
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

  // Use a constant for client detection when needed
  const isClient = typeof window !== "undefined";
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<"visual" | "json">("visual");
  const [
    currentExperience,
    setCurrentExperience
  ] = useState<ExperienceEntry | null>(null);
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
  const { toast } = useToast();

  const router = useRouter();

  useEffect(
    () => {
      const checkEnv = async () => {
        try {
          setLoading(true);
          // Check if user is authenticated
          const isAuthenticated = document.cookie.includes(
            "admin_authenticated=true"
          );
          if (!isAuthenticated) {
            router.push("/admin/login");
            return;
          }

          const res = await fetch("/api/admin");

          if (res.status === 403) {
            setIsDev(false);
            setError("Admin panel is only available in development mode");
            return;
          }

          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await res.json();
          setExperiences(data.experiences);
          setTopSkills(data.topSkills);
          setProfileData(
            data.profileData || {
              name: "",
              title: "",
              location: "",
              email: "",
              linkedin: "",
              profileImageUrl: "",
              summary: "",
              languages: [],
              education: [],
              certifications: []
            }
          );
          setIsDev(true);
          setError(null);
        } catch (err) {
          setError(
            "Error loading data. Make sure you are in development mode."
          );
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      checkEnv();
    },
    [router]
  );
  // Wrapper functions that call the handlers with the necessary state
  const handleSave = async (file: string, data: any) => {
    return handlers.handleSave(file, data, setSaving, toast);
  };

  const handleExperiencesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    handlers.handleExperiencesChange(e, setExperiences);
  };

  const handleTopSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handlers.handleTopSkillsChange(e, setTopSkills);
  };

  const handleProfileDataChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    handlers.handleProfileDataChange(e, setProfileData);
  };

  const handleProfileFieldChange = (field: string, value: string) => {
    handlers.handleProfileFieldChange(
      field,
      value,
      profileData,
      setProfileData
    );
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
      toast
    );
  };

  const deleteExperience = (index: number) => {
    handlers.deleteExperience(index, experiences, setExperiences, toast);
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    handlers.moveExperience(index, direction, experiences, setExperiences);
  };

  const addTag = () => {
    handlers.addTag(
      currentExperience,
      newSkill,
      setCurrentExperience,
      setNewSkill
    );
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
    handlers.generateAutomaticTopSkills(
      experiences,
      setTopSkills,
      setSaving,
      toast
    );
  };

  // Functions for managing languages
  const addLanguage = () => {
    handlers.addLanguage(setCurrentLanguage, setLanguageDialogOpen);
  };

  const editLanguage = (lang: any, index: number) => {
    handlers.editLanguage(
      lang,
      index,
      setCurrentLanguage,
      setLanguageDialogOpen
    );
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

  // Functions for managing education
  const addEducation = () => {
    handlers.addEducation(setCurrentEducation, setEducationDialogOpen);
  };

  const editEducation = (edu: any, index: number) => {
    handlers.editEducation(
      edu,
      index,
      setCurrentEducation,
      setEducationDialogOpen
    );
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

  // Functions for managing certifications
  const addCertification = () => {
    handlers.addCertification(
      setCurrentCertification,
      setCertificationDialogOpen
    );
  };

  const editCertification = (cert: any, index: number) => {
    handlers.editCertification(
      cert,
      index,
      setCurrentCertification,
      setCertificationDialogOpen
    );
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

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <p className="mb-6 text-muted-foreground">
        Edit your data files here. Changes will be saved to the actual files in
        the /data directory. After editing, you should manually commit these
        changes to your repository.
      </p>
      <Tabs defaultValue="experiences">
        <TabsList className="mb-4">
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="topSkills">Top Skills</TabsTrigger>
          <TabsTrigger value="profileData">Profile Data</TabsTrigger>
        </TabsList>

        <TabsContent value="experiences">
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

        <TabsContent value="topSkills">
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

        <TabsContent value="profileData">
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
          />
        </TabsContent>
      </Tabs>{" "}
      {/* Experience Dialog */}
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
      />{" "}
      {/* Language Dialog */}
      <LanguageDialog
        open={languageDialogOpen}
        setOpen={setLanguageDialogOpen}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        saveLanguage={saveLanguage}
      />{" "}
      {/* Education Dialog */}
      <EducationDialog
        open={educationDialogOpen}
        setOpen={setEducationDialogOpen}
        currentEducation={currentEducation}
        setCurrentEducation={setCurrentEducation}
        saveEducation={saveEducation}
      />{" "}
      {/* Certification Dialog */}
      <CertificationDialog
        open={certificationDialogOpen}
        setOpen={setCertificationDialogOpen}
        currentCertification={currentCertification}
        setCurrentCertification={setCurrentCertification}
        saveCertification={saveCertification}
      />
    </div>
  );
}
