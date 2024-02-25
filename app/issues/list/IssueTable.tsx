import React from "react";
import { Table, TableCell } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/components";
import NextLink from "next/link";
import { Issue, Status } from "@prisma/client";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";

type Sort = "asc" | "desc" | "";

export interface IssueQuery {
  status: Status;
  orderBy: keyof Issue;
  sort: Sort;
  page: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: Issue[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
  const handleSort = () => {
    if (searchParams.sort === "asc") {
      return "desc";
    } else if (searchParams.sort === "desc") {
      return "";
    } else {
      return "asc";
    }
  };

  const arrowIcon = () => {
    if (searchParams.sort === "asc") {
      return <ArrowUpIcon className="inline" />;
    } else if (searchParams.sort === "desc") {
      return <ArrowDownIcon className="inline" />;
    }
  };

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((col) => (
            <Table.ColumnHeaderCell key={col.value} className={col.className}>
              <NextLink
                href={{
                  query: {
                    ...searchParams,
                    orderBy: col.value,
                    sort: handleSort(),
                  },
                }}
              >
                {col.label}
              </NextLink>
              {col.value === searchParams.orderBy && arrowIcon()}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {issues.map((issue) => (
          <Table.Row key={issue.id}>
            <TableCell>
              <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
              <div className="block md:hidden">
                <IssueStatusBadge status={issue.status} />
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <IssueStatusBadge status={issue.status} />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {issue.createdAt.toDateString()}
            </TableCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: { label: string; value: keyof Issue; className?: string }[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
];

export const columnNames = columns.map((col) => col.value);

export default IssueTable;
