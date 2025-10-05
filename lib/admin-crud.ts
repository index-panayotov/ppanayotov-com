import { apiClient } from "@/lib/api-client";

/**
 * Generic CRUD operations for admin panel
 * Eliminates code duplication across different entity types
 */

export interface CrudItem {
  _index?: number;
  [key: string]: any;
}

export interface CrudOperations<T extends CrudItem> {
  add: (item: Omit<T, '_index'>) => Promise<void>;
  update: (index: number, item: Omit<T, '_index'>) => Promise<void>;
  delete: (index: number) => Promise<void>;
  move: (index: number, direction: 'up' | 'down') => Promise<void>;
}

export interface CrudConfig<T extends CrudItem> {
  fileName: string;
  getItems: () => T[];
  setItems: (items: T[]) => void;
  validateItem?: (item: Omit<T, '_index'>) => string | null;
  getItemName?: (item: T) => string;
}

export interface ToastFunction {
  (config: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
    className?: string;
  }): void;
}

/**
 * Generic CRUD hook factory
 */
export function createCrudOperations<T extends CrudItem>(
  config: CrudConfig<T>,
  toast: ToastFunction,
  setSaving: (saving: boolean) => void
): CrudOperations<T> {

  const { fileName, getItems, setItems, validateItem, getItemName } = config;

  const getItemDisplayName = (item: T): string => {
    if (getItemName) return getItemName(item);
    return 'item';
  };

  const validateAndSave = async (
    newItems: T[],
    action: string,
    itemName: string
  ): Promise<void> => {
    try {
      setSaving(true);

      // Optimistic update
      setItems(newItems);

      // Persist to file system
      await apiClient.post("/api/admin", {
        file: fileName,
        data: newItems.filter((item): item is T => item !== undefined).map(item => {
          const { _index, ...cleanItem } = item;
          return cleanItem;
        })
      });

      toast({
        title: `Success`,
        description: `${action} "${itemName}" and saved to file`,
        className: "bg-green-50 border-green-200 text-green-800"
      });

    } catch (error) {
      // Revert on error
      setItems(getItems());
      toast({
        title: "Save Failed",
        description: `Failed to ${action.toLowerCase()} "${itemName}". Please try again.`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    add: async (item: Omit<T, '_index'>) => {
      if (validateItem) {
        const error = validateItem(item);
        if (error) {
          toast({
            title: "Validation Error",
            description: error,
            variant: "destructive"
          });
          return;
        }
      }

      const newItems = [...getItems(), item as T];
      await validateAndSave(newItems, "Added", getItemDisplayName(item as T));
    },

    update: async (index: number, item: Omit<T, '_index'>) => {
      if (validateItem) {
        const error = validateItem(item);
        if (error) {
          toast({
            title: "Validation Error",
            description: error,
            variant: "destructive"
          });
          return;
        }
      }

      const currentItems = getItems();
      if (index < 0 || index >= currentItems.length) {
        toast({
          title: "Error",
          description: "Invalid item index",
          variant: "destructive"
        });
        return;
      }

      const newItems = [...currentItems];
      newItems[index] = { ...item, _index: index } as T;
      await validateAndSave(newItems, "Updated", getItemDisplayName(newItems[index]));
    },

    delete: async (index: number) => {
      const currentItems = getItems();
      if (index < 0 || index >= currentItems.length) {
        toast({
          title: "Error",
          description: "Invalid item index",
          variant: "destructive"
        });
        return;
      }

      const itemToDelete = currentItems[index];
      if (!itemToDelete) {
        toast({
          title: "Error",
          description: "Item not found",
          variant: "destructive"
        });
        return;
      }
      const itemName = getItemDisplayName(itemToDelete);
      const newItems = currentItems.filter((_, i) => i !== index);

      try {
        setSaving(true);
        setItems(newItems);

        await apiClient.post("/api/admin", {
          file: fileName,
          data: newItems.map(item => {
            const { _index, ...cleanItem } = item;
            return cleanItem;
          })
        });

        toast({
          title: "Deleted",
          description: `"${itemName}" has been removed and saved to file`,
          variant: "destructive"
        });

      } catch (error) {
        setItems(getItems());
        toast({
          title: "Delete Failed",
          description: "Failed to delete item. Please try again.",
          variant: "destructive"
        });
        throw error;
      } finally {
        setSaving(false);
      }
    },

    move: async (index: number, direction: 'up' | 'down') => {
      const items = getItems();
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === items.length - 1)
      ) {
        return;
      }

      if (index < 0 || index >= items.length) {
        toast({
          title: "Error",
          description: "Invalid item index",
          variant: "destructive"
        });
        return;
      }

      const newItems = [...items];
      const newIndex = direction === "up" ? index - 1 : index + 1;

      const itemAtIndex = newItems[index];
      const itemAtNewIndex = newItems[newIndex];

      if (!itemAtIndex || !itemAtNewIndex) {
        toast({
          title: "Error",
          description: "Failed to move item",
          variant: "destructive"
        });
        return;
      }

      [newItems[index], newItems[newIndex]] = [itemAtNewIndex, itemAtIndex];

      const movedItem = newItems[newIndex];
      const itemName = getItemDisplayName(movedItem);

      try {
        setSaving(true);
        setItems(newItems);

        await apiClient.post("/api/admin", {
          file: fileName,
          data: newItems.map(item => {
            const { _index, ...cleanItem } = item;
            return cleanItem;
          })
        });

        toast({
          title: "Reordered",
          description: `"${itemName}" moved ${direction} and saved to file`,
          className: "bg-green-50 border-green-200 text-green-800"
        });

      } catch (error) {
        setItems(getItems());
        toast({
          title: "Reorder Failed",
          description: "Failed to save the new order. Please try again.",
          variant: "destructive"
        });
        throw error;
      } finally {
        setSaving(false);
      }
    }
  };
}

/**
 * Simple synchronous operations for UI state management (no API calls)
 */
export function createSyncCrudOperations<T extends CrudItem>(
  getItems: () => T[],
  setItems: (items: T[]) => void
) {
  return {
    addSync: (item: Omit<T, '_index'>) => {
      setItems([...getItems(), item as T]);
    },

    updateSync: (index: number, item: Omit<T, '_index'>) => {
      const currentItems = getItems();
      if (index < 0 || index >= currentItems.length) {
        return;
      }
      const newItems = [...currentItems];
      newItems[index] = item as T;
      setItems(newItems);
    },

    deleteSync: (index: number) => {
      const currentItems = getItems();
      if (index < 0 || index >= currentItems.length) {
        return;
      }
      setItems(currentItems.filter((_, i) => i !== index));
    },

    moveSync: (index: number, direction: 'up' | 'down') => {
      const items = getItems();
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === items.length - 1) ||
        index < 0 || index >= items.length
      ) {
        return;
      }

      const newItems = [...items];
      const newIndex = direction === "up" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= newItems.length) {
        return;
      }

      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      setItems(newItems);
    }
  };
}