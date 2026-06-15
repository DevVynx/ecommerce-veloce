import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/components/shadcn-ui/input-group";

export const SearchInput = () => {
  return (
    <form action="/search" method="GET" className="flex-1">
      <InputGroup className="border-primary rounded-lg">
        <InputGroupInput name="q" placeholder="Busque os seus produtos." />
        <InputGroupAddon className="pr-2" align="inline-end">
          <InputGroupButton
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground w-15"
            aria-label="Search"
            title="Search"
            size="icon-sm"
          >
            <Search />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};
