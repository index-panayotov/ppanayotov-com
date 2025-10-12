import React, { useState, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { GripVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { SocialLink } from '@/lib/schemas';
import { getSocialIcon } from '@/lib/social-platforms';

interface SocialLinksReorderProps {
  socialLinks: SocialLink[];
  onReorder: (reorderedLinks: SocialLink[]) => void;
  onEdit: (link: SocialLink, index: number) => void;
  onDelete: (index: number) => void;
  onToggleVisibility: (index: number, field: 'visible' | 'visibleInHero', value: boolean) => void;
  onBulkToggle: (indices: number[], field: 'visible' | 'visibleInHero', value: boolean) => void;
}

export const SocialLinksReorder: React.FC<SocialLinksReorderProps> = ({
  socialLinks,
  onReorder,
  onEdit,
  onDelete,
  onToggleVisibility,
  onBulkToggle
}) => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    setIsDragging(false);

    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    const reorderedLinks = Array.from(socialLinks);
    const [reorderedItem] = reorderedLinks.splice(sourceIndex, 1);
    reorderedLinks.splice(destinationIndex, 0, reorderedItem);

    // Update position values
    const updatedLinks = reorderedLinks.map((link, index) => ({
      ...link,
      position: index
    }));

    onReorder(updatedLinks);
  }, [socialLinks, onReorder]);

  const handleSelectToggle = useCallback((index: number) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  }, [selectedIndices]);

  const handleSelectAll = useCallback(() => {
    if (selectedIndices.size === socialLinks.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(socialLinks.map((_, index) => index)));
    }
  }, [selectedIndices.size, socialLinks.length]);

  const handleBulkVisibilityToggle = useCallback((field: 'visible' | 'visibleInHero', value: boolean) => {
    const indices = Array.from(selectedIndices);
    onBulkToggle(indices, field, value);
    setSelectedIndices(new Set());
  }, [selectedIndices, onBulkToggle]);

  const hasSelection = selectedIndices.size > 0;
  const allSelected = selectedIndices.size === socialLinks.length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions Header */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="rounded border-slate-300"
            />
            <span className="text-sm font-medium">
              {hasSelection ? `${selectedIndices.size} selected` : 'Select all'}
            </span>
          </div>

          {hasSelection && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkVisibilityToggle('visible', true)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Show
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkVisibilityToggle('visible', false)}
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Hide
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkVisibilityToggle('visibleInHero', true)}
              >
                Add to Hero
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkVisibilityToggle('visibleInHero', false)}
              >
                Remove from Hero
              </Button>
            </div>
          )}
        </div>


      </div>

      {/* Drag & Drop List */}
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="social-links">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 transition-colors ${
                snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-2' : ''
              }`}
            >
              {socialLinks.map((link, index) => (
                <Draggable
                  key={`${link.platform}-${index}`}
                  draggableId={`${link.platform}-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-all duration-200 ${
                        snapshot.isDragging
                          ? 'shadow-lg rotate-2 scale-105'
                          : selectedIndices.has(index)
                          ? 'ring-2 ring-blue-500'
                          : ''
                      } ${isDragging ? 'select-none' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Selection Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedIndices.has(index)}
                            onChange={() => handleSelectToggle(index)}
                            className="rounded border-slate-300"
                          />

                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>

                          {/* Platform Icon & Info */}
                          <div className="flex items-center gap-3 flex-1">
                            {getSocialIcon(link.platform.toLowerCase(), "w-5 h-5")}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {link.platform === 'Custom' ? link.label : link.platform}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  #{index + 1}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 truncate max-w-md">
                                {link.url}
                              </p>
                            </div>
                          </div>

                          {/* Visibility Toggles */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-slate-600">Visible:</label>
                              <Switch
                                checked={link.visible}
                                onCheckedChange={(checked) =>
                                  onToggleVisibility(index, 'visible', checked)
                                }
                                size="sm"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-slate-600">Hero:</label>
                              <Switch
                                checked={link.visibleInHero}
                                onCheckedChange={(checked) =>
                                  onToggleVisibility(index, 'visibleInHero', checked)
                                }
                                size="sm"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onEdit(link, index)}
                              className="text-slate-600 hover:text-slate-900"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDelete(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {socialLinks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-slate-400 mb-2">
              <GripVertical className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-slate-600">No social links added yet</p>
            <p className="text-sm text-slate-500">Add some links to organize them here</p>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {socialLinks.length > 1 && (
        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Tips:</p>
          <ul className="space-y-1">
            <li>• Drag the grip handle to reorder social links</li>
            <li>• Use checkboxes to select multiple links for bulk actions</li>
            <li>• Toggle visibility switches to control where links appear</li>
            <li>• Links appear in this order on your website</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SocialLinksReorder;