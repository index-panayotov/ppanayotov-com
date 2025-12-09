import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Pencil } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { getSocialIcon } from '@/lib/social-platforms';
import { SocialLinkWithIndex } from '@/lib/handlers/types';

interface SocialLinksReorderProps {
  socialLinks: SocialLinkWithIndex[];
  onReorder: (newLinks: SocialLinkWithIndex[]) => void;
  onDelete: (index: number) => void;
  onEdit: (link: SocialLinkWithIndex, index: number) => void;
  onToggleVisibility: (index: number, field: 'visible' | 'visibleInHero', value: boolean) => void;
}

export default function SocialLinksReorder({
  socialLinks,
  onReorder,
  onDelete,
  onEdit,
  onToggleVisibility
}: SocialLinksReorderProps) {
  // Drag and drop functionality removed due to missing dependencies
  // Using simple list rendering instead

  return (
    <div className="space-y-3">
      {socialLinks.map((link, index) => (
        <div
          key={`${link.platform}-${index}`}
          className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-slate-400 cursor-default" title="Reordering temporarily disabled">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              {getSocialIcon(link.platform.toLowerCase(), "h-5 w-5")}
              <span className="font-medium text-slate-900">
                {link.platform === 'Custom' ? (link.label || 'Custom Link') : link.platform}
              </span>
            </div>
            <div className="text-xs text-slate-400 hidden sm:block truncate max-w-[200px]">
              {link.url}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2" title="Show in Contact section">
              <span className="text-[10px] uppercase font-bold text-slate-500 hidden sm:inline-block">Contact</span>
              <Switch
                checked={link.visible}
                onCheckedChange={(checked) => onToggleVisibility(index, 'visible', checked)}
                className="scale-75 data-[state=checked]:bg-green-600"
              />
            </div>
            
            <div className="flex items-center gap-2" title="Show in Hero section">
              <span className="text-[10px] uppercase font-bold text-slate-500 hidden sm:inline-block">Hero</span>
              <Switch
                checked={link.visibleInHero}
                onCheckedChange={(checked) => onToggleVisibility(index, 'visibleInHero', checked)}
                className="scale-75 data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => onEdit(link, index)}
                title="Edit link"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(index)}
                title="Delete link"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {socialLinks.length === 0 && (
        <div className="text-center py-12 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-slate-500 mb-1">No social links added yet.</p>
          <p className="text-sm text-slate-400">Add links to your social media profiles to display them on your site.</p>
        </div>
      )}
    </div>
  );
}
