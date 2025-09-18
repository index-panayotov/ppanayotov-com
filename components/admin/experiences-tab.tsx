"use client";

import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowUp, ArrowDown, Edit, Trash2, Briefcase } from "lucide-react";
import { ExperiencesTabProps } from "@/types/admin";
import { AdminPageHeader } from "./ui/admin-page-header";
import { AdminCard, AdminCardHeader, AdminCardContent } from "./ui/admin-card";
import { AdminButton, AdminButtonGroup } from "./ui/admin-button";
import { AdminIconButton } from "./ui/admin-button";
import { AdminEmptyState } from "./ui/admin-empty-state";
import { adminClassNames } from "./design-system";

export default function ExperiencesTab({
  experiences,
  setExperiences,
  editMode,
  setEditMode,
  saving,
  handleSave,
  handleExperiencesChange,
  addExperience,
  editExperience,
  deleteExperience,
  moveExperience
}: ExperiencesTabProps) {
  return (
    <div className={adminClassNames.layout.sectionSpacing}>
      {/* Header Section */}
      <AdminPageHeader
        title="Work Experience"
        description="Manage your professional work history and achievements. Changes auto-save when you add or edit experiences."
        actions={
          <AdminButtonGroup>
            <AdminButton
              variant="secondary"
              onClick={() =>
                setEditMode(editMode === "visual" ? "JSON" : "visual")}
            >
              Switch to {editMode === "visual" ? "JSON" : "Visual"} Mode
            </AdminButton>
            {editMode === "json" && (
              <AdminButton
                variant="primary"
                onClick={() => handleSave("cv-data.ts", experiences)}
                disabled={saving}
                loading={saving}
              >
                Save JSON Changes
              </AdminButton>
            )}
          </AdminButtonGroup>
        }
      />

      {editMode === "json"
        ? <Textarea
            className="font-mono h-[70vh]"
            value={JSON.stringify(experiences, null, 2)}
            onChange={handleExperiencesChange}
          />
        : <div className={adminClassNames.layout.sectionSpacing}>
            {/* Add Experience Button */}
            <div className={adminClassNames.layout.flexCenter}>
              <AdminButton 
                variant="primary"
                size="lg"
                onClick={addExperience}
                disabled={saving}
              >
                <Plus className="mr-2 h-5 w-5" /> Add New Experience
              </AdminButton>
            </div>

            {/* Experience Cards */}
            <div className={adminClassNames.layout.cardGrid}>
              {experiences.length === 0 ? (
                <AdminEmptyState
                  icon={<Briefcase className="h-12 w-12" />}
                  title="No experiences yet"
                  description="Get started by adding your first work experience to showcase your professional journey."
                  action={{
                    label: "Add Experience",
                    onClick: addExperience,
                    disabled: saving
                  }}
                />
              ) : (
                experiences.map((exp, index) =>
                  <AdminCard key={index} variant="elevated">
                    <AdminCardHeader
                      title={exp.title}
                      description={
                        <>
                          <span className="font-medium">{exp.company}</span> • {exp.dateRange}
                          {exp.location && <span> • {exp.location}</span>}
                        </>
                      }
                      actions={
                        <>
                          <AdminIconButton
                            variant="ghost"
                            icon={<ArrowUp className="h-4 w-4" />}
                            onClick={() => moveExperience(index, "up")}
                            disabled={index === 0 || saving}
                            tooltip="Move up"
                          />
                          <AdminIconButton
                            variant="ghost"
                            icon={<ArrowDown className="h-4 w-4" />}
                            onClick={() => moveExperience(index, "down")}
                            disabled={index === experiences.length - 1 || saving}
                            tooltip="Move down"
                          />
                          <AdminIconButton
                            variant="primary"
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => editExperience(exp, index)}
                            disabled={saving}
                            tooltip="Edit"
                          />
                          <AdminIconButton
                            variant="danger"
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => deleteExperience(index)}
                            disabled={saving}
                            tooltip="Delete"
                          />
                        </>
                      }
                    />
                    <AdminCardContent>
                      <p className={`${adminClassNames.text.body} text-sm leading-relaxed mb-4 line-clamp-3`}>
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.slice(0, 8).map((tag, i) =>
                          <Badge key={i} className={adminClassNames.badge.primary}>
                            {tag}
                          </Badge>
                        )}
                        {exp.tags.length > 8 &&
                          <Badge className={adminClassNames.badge.secondary}>
                            +{exp.tags.length - 8} more
                          </Badge>}
                      </div>
                    </AdminCardContent>
                  </AdminCard>
                )
              )}
            </div>
          </div>}
    </div>
  );
}
