"use client";

import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";
import { useTranslations } from "next-intl";

interface EditProfileButtonProps {
  user: UserData;
}

export default function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const t = useTranslations("user");
  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        {t("editProfile")}
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}