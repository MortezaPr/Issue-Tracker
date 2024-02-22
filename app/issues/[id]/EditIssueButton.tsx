import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

const EditIssueButton = ({ issueId }: { issueId: number }) => {
  return (
    <Button>
      <Link
        className="w-full flex justify-center items-center gap-2"
        href={`/issues/edit/${issueId}`}
      >
        <Pencil2Icon />
        Edit Issue
      </Link>
    </Button>
  );
};

export default EditIssueButton;
