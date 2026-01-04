import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const DUMMY_ACCOUNTS = [
  {
    id: 1,
    accountName: "JULI ENTERPRISES",
    accountOwner: "Digamber Pandey",
    accountStatus: "Awareness",
    source: "Himalaya",
    businessType: "Distributor",
    city: "LUCKNOW",
    state: "Uttar Pradesh",
    callBack: "Jan 1, 2026 01:00 PM",
  },
  {
    id: 2,
    accountName: "JANTA MEDICINE CENTER",
    accountOwner: "Sahil Kispotta",
    accountStatus: "Assessment",
    source: "Himalaya",
    businessType: "Distributor",
    city: "DORAHA",
    state: "Punjab",
    callBack: "Dec 8, 2025 01:00 PM",
  },
  {
    id: 3,
    accountName: "Naresh Kumar & Sons",
    accountOwner: "Sahil Kispotta",
    accountStatus: "Lender Review",
    source: "Himalaya",
    businessType: "Distributor",
    city: "ABOHAR",
    state: "Punjab",
    callBack: "Dec 5, 2025 04:30 PM",
  },
];

export default function AccountsPage() {
  const navigate = useNavigate();
  const [accounts] = useState(DUMMY_ACCOUNTS);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Accounts Database</h1>
          <p className="text-muted-foreground">Manage your accounts here.</p>
        </div>

        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-4">
        <div className="border rounded-md p-3 space-y-3 bg-background">
          <h3 className="font-semibold text-sm">Filter Accounts by</h3>

          <Input placeholder="Account Name" />

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Account Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Awareness">Awareness</SelectItem>
              <SelectItem value="Assessment">Assessment</SelectItem>
              <SelectItem value="Lender Review">Lender Review</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Himalaya">Himalaya</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type of Business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Distributor">Distributor</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="City" />
          <Input placeholder="State" />
          <Input placeholder="Pincode" />

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Business Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Call Back Date / Time" />
        </div>

        <div className="border rounded-md p-2 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Account Owner</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Type of Business</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Call Back Date / Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {accounts.map((acc) => (
                <TableRow
                  key={acc.id}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => navigate("/update-accounts")}
                >
                  <TableCell className="font-medium text-primary ">
                    {acc.accountName}
                  </TableCell>
                  <TableCell className="text-primary ">
                    {acc.accountOwner}
                  </TableCell>
                  <TableCell className="text-primary ">
                    {acc.accountStatus}
                  </TableCell>
                  <TableCell className="text-primary ">{acc.source}</TableCell>
                  <TableCell className="text-primary ">
                    {acc.businessType}
                  </TableCell>
                  <TableCell className="text-primary ">{acc.city}</TableCell>
                  <TableCell className="text-primary ">{acc.state}</TableCell>
                  <TableCell className="text-primary ">
                    {acc.callBack}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
