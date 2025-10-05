"use client";

import { useState, useEffect } from "react";
import { AdminPageHeader } from "./ui/admin-page-header";
import { AdminCard, AdminCardHeader, AdminCardContent } from "./ui/admin-card";
import { AdminButton } from "./ui/admin-button";
import { Badge } from "@/components/ui/badge";
import { Check, Eye, Palette, Settings as SettingsIcon, Globe, Code, Printer, BarChart3 } from "lucide-react";
import { getAllTemplates } from "@/app/templates/template-registry";
import { SystemSettings } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SettingsTabProps {
  saving: boolean;
  handleSave: (file: string, data: any) => Promise<void>;
  systemSettings: SystemSettings;
  setSystemSettings: (settings: SystemSettings) => void;
}

/**
 * Settings Tab - Manage system-wide settings
 *
 * Includes:
 * - Template selection
 * - Feature toggles (blog, contacts, print, WYSIWYG)
 * - Analytics configuration
 * - PWA settings
 */
export default function SettingsTab({ saving, handleSave, systemSettings, setSystemSettings }: SettingsTabProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(systemSettings.selectedTemplate);
  const [blogEnable, setBlogEnable] = useState(systemSettings.blogEnable);
  const [useWysiwyg, setUseWysiwyg] = useState(systemSettings.useWysiwyg);
  const [showContacts, setShowContacts] = useState(systemSettings.showContacts);
  const [showPrint, setShowPrint] = useState(systemSettings.showPrint);
  const [gtagEnabled, setGtagEnabled] = useState(systemSettings.gtagEnabled);
  const [gtagCode, setGtagCode] = useState(systemSettings.gtagCode);

  const { toast } = useToast();
  const templates = getAllTemplates();

  // Sync local state with props when systemSettings changes
  useEffect(() => {
    setSelectedTemplate(systemSettings.selectedTemplate);
    setBlogEnable(systemSettings.blogEnable);
    setUseWysiwyg(systemSettings.useWysiwyg);
    setShowContacts(systemSettings.showContacts);
    setShowPrint(systemSettings.showPrint);
    setGtagEnabled(systemSettings.gtagEnabled);
    setGtagCode(systemSettings.gtagCode);
  }, [systemSettings]);

  const saveSettings = async (updates: Partial<typeof systemSettings>) => {
    try {
      const updatedSettings = {
        ...systemSettings,
        ...updates
      };

      console.log('[SettingsTab] Saving settings:', {
        updates,
        selectedTemplate: updatedSettings.selectedTemplate,
        allKeys: Object.keys(updatedSettings)
      });

      await handleSave("system_settings.ts", updatedSettings);

      // Update parent component state to keep everything in sync
      setSystemSettings(updatedSettings);

      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectTemplate = async (templateId: "classic" | "professional" | "modern") => {
    setSelectedTemplate(templateId);
    await saveSettings({ selectedTemplate: templateId });
  };

  const handleToggle = async (key: keyof typeof systemSettings, value: boolean) => {
    switch (key) {
      case 'blogEnable':
        setBlogEnable(value);
        break;
      case 'useWysiwyg':
        setUseWysiwyg(value);
        break;
      case 'showContacts':
        setShowContacts(value);
        break;
      case 'showPrint':
        setShowPrint(value);
        break;
      case 'gtagEnabled':
        setGtagEnabled(value);
        break;
    }
    await saveSettings({ [key]: value });
  };

  const handleGtagCodeChange = async () => {
    await saveSettings({ gtagCode });
  };

  const handlePreview = () => {
    window.open("/", "_blank");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={SettingsIcon}
        title="System Settings"
        description="Configure your CV site appearance, features, and integrations."
        action={{
          label: "Preview Homepage",
          onClick: handlePreview,
          icon: Eye,
          variant: "outline"
        }}
      />

      {/* Template Selection Section */}
      <AdminCard>
        <AdminCardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">CV Template</h3>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Choose how your CV appears to visitors. All templates use the same data.
          </p>
        </AdminCardHeader>
        <AdminCardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {templates.map((template) => {
              const isSelected = selectedTemplate === template.id;

              return (
                <div
                  key={template.id}
                  className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-blue-600 text-white gap-1">
                        <Check className="h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                  )}

                  <div className="mb-3">
                    <h4 className="font-bold text-slate-900 mb-1">{template.name}</h4>
                    <p className="text-xs text-slate-600">{template.description}</p>
                  </div>

                  <div className="mb-3">
                    <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded flex items-center justify-center">
                      <Palette className="h-8 w-8 text-slate-400" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {template.bestFor.slice(0, 2).map((use, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <AdminButton
                    variant={isSelected ? "outline" : "primary"}
                    size="sm"
                    className="w-full"
                    onClick={() => handleSelectTemplate(template.id as "classic" | "professional" | "modern")}
                    disabled={isSelected || saving}
                  >
                    {isSelected ? "Active" : "Select"}
                  </AdminButton>
                </div>
              );
            })}
          </div>
        </AdminCardContent>
      </AdminCard>

      {/* Feature Toggles Section */}
      <AdminCard>
        <AdminCardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-slate-900">Features</h3>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Enable or disable site features
          </p>
        </AdminCardHeader>
        <AdminCardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="blog-enable" className="font-medium text-slate-900 cursor-pointer">
                  Blog Section
                </Label>
                <p className="text-sm text-slate-600">Enable blog functionality (coming soon)</p>
              </div>
              <Switch
                id="blog-enable"
                checked={blogEnable}
                onCheckedChange={(checked) => handleToggle('blogEnable', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="wysiwyg" className="font-medium text-slate-900 cursor-pointer">
                  WYSIWYG Editor
                </Label>
                <p className="text-sm text-slate-600">Use visual editor for experience descriptions</p>
              </div>
              <Switch
                id="wysiwyg"
                checked={useWysiwyg}
                onCheckedChange={(checked) => handleToggle('useWysiwyg', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="contacts" className="font-medium text-slate-900 cursor-pointer">
                  Contact Section
                </Label>
                <p className="text-sm text-slate-600">Show contact information on homepage</p>
              </div>
              <Switch
                id="contacts"
                checked={showContacts}
                onCheckedChange={(checked) => handleToggle('showContacts', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="print" className="font-medium text-slate-900 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    Print/PDF Features
                  </div>
                </Label>
                <p className="text-sm text-slate-600">Enable print and PDF export (work in progress)</p>
              </div>
              <Switch
                id="print"
                checked={showPrint}
                onCheckedChange={(checked) => handleToggle('showPrint', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </AdminCardContent>
      </AdminCard>

      {/* Analytics Section */}
      <AdminCard>
        <AdminCardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-900">Analytics</h3>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Configure Google Analytics tracking
          </p>
        </AdminCardHeader>
        <AdminCardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="gtag-enabled" className="font-medium text-slate-900 cursor-pointer">
                  Google Analytics
                </Label>
                <p className="text-sm text-slate-600">Enable visitor tracking</p>
              </div>
              <Switch
                id="gtag-enabled"
                checked={gtagEnabled}
                onCheckedChange={(checked) => handleToggle('gtagEnabled', checked)}
                disabled={saving}
              />
            </div>

            {gtagEnabled && (
              <div className="space-y-2">
                <Label htmlFor="gtag-code" className="text-sm font-medium text-slate-900">
                  Google Tag Manager ID
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="gtag-code"
                    value={gtagCode}
                    onChange={(e) => setGtagCode(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="flex-1"
                  />
                  <AdminButton
                    variant="outline"
                    onClick={handleGtagCodeChange}
                    disabled={saving || gtagCode === systemSettings.gtagCode}
                  >
                    Save
                  </AdminButton>
                </div>
                <p className="text-xs text-slate-500">
                  Enter your Google Analytics measurement ID (e.g., G-XXXXXXXXXX)
                </p>
              </div>
            )}
          </div>
        </AdminCardContent>
      </AdminCard>

      {/* Information Card */}
      <AdminCard>
        <AdminCardContent>
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <Code className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-900 mb-1">About Settings</p>
              <p>
                Changes are saved to <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">data/system_settings.ts</code> and take effect immediately.
                Template changes require a page refresh to see the new design.
              </p>
            </div>
          </div>
        </AdminCardContent>
      </AdminCard>
    </div>
  );
}
