"use client";

import { Button } from "@/components/ui/button";
import { AIEnhancedInput } from "./ai-enhanced-input";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import { TopSkillsTabProps } from "@/types/admin-components";

/**
 * Displays and manages a list of top professional skills with visual editing interface.
 *
 * Provides an interface for adding, removing, reordering, and saving top skills, as well as automatically generating skill suggestions.
 */
export default function TopSkillsTab({
  topSkills,
  saving,
  handleSave,
  addTopSkill,
  removeTopSkill,
  moveTopSkill,
  generateAutomaticTopSkills,
  newSkill,
  setNewSkill
}: TopSkillsTabProps) {
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">
            Manage featured skills displayed on your CV
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={generateAutomaticTopSkills}
            disabled={saving}
          >
            Auto-Generate
          </Button>
          <Button
            onClick={() => handleSave("topSkills", topSkills)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
            <div className="flex gap-2">
              {" "}<AIEnhancedInput
                placeholder="Add new skill"
                fieldName="professional skill"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTopSkill()}
              />
              <Button onClick={addTopSkill}>Add Skill</Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {topSkills.map((skill, index) =>
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <span>
                        {skill}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveTopSkill(index, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveTopSkill(index, "down")}
                          disabled={index === topSkills.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTopSkill(skill)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
           </div>
    </div>
  );
}
