
import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Share2, UserPlus, X } from "lucide-react";

interface ShareTaskProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onShare: (taskId: string, emails: string[]) => void;
}

export const ShareTask = ({ isOpen, onClose, task, onShare }: ShareTaskProps) => {
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);

  const handleAddEmail = () => {
    if (email.trim() && !emailList.includes(email.trim())) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email.trim())) {
        setEmailList([...emailList, email.trim()]);
        setEmail("");
      }
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailList(emailList.filter(e => e !== emailToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleShare = () => {
    if (emailList.length > 0) {
      onShare(task.id, emailList);
      setEmailList([]);
      setEmail("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Task Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>

          {/* Currently Shared With */}
          {task.sharedWith.length > 0 && (
            <div className="space-y-2">
              <Label>Currently shared with:</Label>
              <div className="flex flex-wrap gap-2">
                {task.sharedWith.map((email) => (
                  <Badge key={email} variant="outline">
                    {email}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Add people by email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddEmail}
                variant="outline"
                size="icon"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Email List */}
          {emailList.length > 0 && (
            <div className="space-y-2">
              <Label>Will be shared with:</Label>
              <div className="flex flex-wrap gap-2">
                {emailList.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleShare}
              disabled={emailList.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Share Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
