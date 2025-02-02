import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SubjectDialogProps {
  open: boolean;
  subjectOptions: string[];
  handleSubjectSelect: (subject: string) => void;
}

const SubjectDialog: React.FC<SubjectDialogProps> = ({
  open,
  subjectOptions,
  handleSubjectSelect
}) => {
  return (
    <Dialog 
      open={open} 
      onOpenChange={() => {}} // Disable dialog closing
      modal={true}
    >
      <DialogContent 
        className={cn(
          "sm:max-w-md h-96",
          "[&>button]:hidden" // Hide the close button using CSS
        )}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold">Choose Your Subject</DialogTitle>
          <DialogDescription>
            Select a subject to start your learning session
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto max-h-64 pr-2">
          {subjectOptions.map((subject: string) => (
            <Button
              key={subject}
              onClick={() => handleSubjectSelect(subject)}
              variant="outline"
              className="w-full"
            >
              {subject}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectDialog;