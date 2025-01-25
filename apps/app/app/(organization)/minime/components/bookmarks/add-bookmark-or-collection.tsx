"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ExportButton from "@/components/forms/export-button";
import { Icons } from "@repo/design-system/components/ui/icons";
import Button from "@repo/design-system/components/minime/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design-system/components/ui/popover";
import AddEditBookmarkModal from "./add-edit-bookmark-modal";
import AddEditCollectionModal from "./collections/add-edit-collection-modal";
import { Collection } from "@/helper/utils";
export type Action = "newBookmark" | "newCollection" | "manageCollections";

export default function AddBookmarkOrCollection({
  collections,
}: {
  collections: Collection[];
}) {
  const action = (useSearchParams().get("action") as Action) || "";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (action === "newBookmark" || action === "newCollection") {
      setIsOpen(true);
    }
  }, [action]);

  return (
    <Popover modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="data-[state=open]:bg-gray-2 data-[state=open]:text-secondary"
          aria-label="Add bookmark or collection"
        >
          <Icons.more size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="bg-gray-3 p-1  flex flex-col">
        <AddEditBookmarkModal
          open={action === "newBookmark"}
          collections={collections}
        />
        <AddEditCollectionModal open={action === "newCollection"} />
        <ExportButton
          text="Export bookmarks"
          buttonVariant="ghost"
          endpoint="bookmarks/export"
        />
      </PopoverContent>
    </Popover>
  );
}
