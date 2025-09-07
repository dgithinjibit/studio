
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClass: (className: string) => void;
}

export function AddClassDialog({ open, onOpenChange, onAddClass }: AddClassDialogProps) {
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;
    
    setLoading(true);
    onAddClass(className);
    setLoading(false);
    onOpenChange(false);
    setClassName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Class</DialogTitle>
          <DialogDescription>
            Enter the name for your new class. You can add students later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="py-4">
              <Label htmlFor="className">Class Name</Label>
              <Input 
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g., Form 3 Mathematics"
                required
              />
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
