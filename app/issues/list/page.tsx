import prisma from "@/prisma/client";
import { Table, TableCell } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/components";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";
import NextLink from "next/link";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";

interface Props {
  searchParams: {
    status: Status;
    orderBy: keyof Issue;
    sort: "asc" | "desc" | "";
  };
}

const IssuesPage = async ({ searchParams }: Props) => {
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const sortOrder = () => {
    return searchParams.sort === "asc" || searchParams.sort === "desc"
      ? { [searchParams.orderBy]: searchParams.sort }
      : undefined;
  };

  const orderBy = columns
    .map((column) => column.value)
    .includes(searchParams.orderBy)
    ? sortOrder()
    : undefined;

  const issues = await prisma.issue.findMany({
    where: {
      status,
    },
    orderBy,
  });

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
    <div>
      <IssueActions />
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
    </div>
  );
};

export const dynamic = "force-dynamic";

export default IssuesPage;
