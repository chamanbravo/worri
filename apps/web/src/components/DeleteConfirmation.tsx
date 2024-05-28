import { Button } from "@ui/index";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/index";

interface Props {
  buttonTitle: string;
  onDelete: () => void;
}

export function DeleteConfirmation({ buttonTitle, onDelete }: Props) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" variant="destructive">
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete data from
            database.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={onDelete} variant="destructive">
                Delete
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
