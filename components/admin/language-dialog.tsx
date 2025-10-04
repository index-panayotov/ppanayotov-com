import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AIEnhancedInput } from '@/components/admin/ai-enhanced-input';
import { LanguageProficiency } from '@/lib/schemas';

interface LanguageDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentLanguage: { name: string; proficiency: LanguageProficiency; _index?: number } | null;
  setCurrentLanguage: (lang: { name: string; proficiency: LanguageProficiency; _index?: number } | null) => void;
  saveLanguage: () => void;
}

const LanguageDialog: React.FC<LanguageDialogProps> = ({
  open,
  setOpen,
  currentLanguage,
  setCurrentLanguage,
  saveLanguage,
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {currentLanguage?._index !== undefined ? 'Edit Language' : 'Add New Language'}
        </DialogTitle>
        <DialogDescription>
          Enter language details
        </DialogDescription>
      </DialogHeader>
      {currentLanguage && (
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Language Name</label>            <AIEnhancedInput 
              id="name" 
              fieldName="language name"
              value={currentLanguage.name} 
              onChange={(e) => setCurrentLanguage({ ...currentLanguage, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="proficiency" className="text-sm font-medium">Proficiency Level</label>            <select 
              id="proficiency"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={currentLanguage.proficiency} 
              onChange={(e) => setCurrentLanguage({ ...currentLanguage, proficiency: e.target.value as LanguageProficiency })}
            >
              {Object.values(LanguageProficiency).map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={saveLanguage}>Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default LanguageDialog;
