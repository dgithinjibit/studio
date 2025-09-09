
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClass: (className: string, color: string) => void;
}

const colors = [
  'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 
  'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-teal-500'
];

export function AddClassDialog({ open, onOpenChange, onAddClass }: AddClassDialogProps) {
  const [className, setClassName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;
    
    setLoading(true);
    onAddClass(className, selectedColor);
    setLoading(false);
    onOpenChange(false);
    setClassName('');
    setSelectedColor(colors[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Class</DialogTitle>
          <DialogDescription>
            Enter the name for your new class and choose a color. You can add students later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="className">Class Name</Label>
                <Input 
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g., Form 3 Mathematics"
                  required
                />
              </div>
              <div>
                <Label>Class Color</Label>
                <div className="flex gap-2 pt-2">
                  {colors.map(color => (
                    <button
                      type="button"
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110",
                        color,
                        selectedColor === color ? 'border-primary ring-2 ring-offset-2 ring-primary' : 'border-transparent'
                      )}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Class
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
